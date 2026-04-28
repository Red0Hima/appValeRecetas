from __future__ import annotations

import os
import re
import shutil
import subprocess
import threading
from dataclasses import dataclass
from pathlib import Path

import tkinter as tk
from tkinter import filedialog, messagebox, ttk

FILE_FILTERS = [
    (
        "Media files",
        "*.mp3 *.wav *.flac *.m4a *.aac *.ogg *.wma *.aiff *.alac *.opus *.amr *.webm *.mp4 *.mkv *.mov *.avi *.wmv *.m4v *.flv",
    ),
    ("All files", "*.*"),
]
OUTPUT_FORMAT_SUGGESTIONS = [
    "ogg",
    "mp3",
    "wav",
    "flac",
    "m4a",
    "aac",
    "opus",
    "wma",
    "mp4",
    "mkv",
    "mov",
    "avi",
    "webm",
    "gif",
]
INVALID_FILENAME_CHARS = re.compile(r'[<>:"/\\|?*\x00-\x1F]')
VALID_EXTENSION_CHARS = re.compile(r"^[a-z0-9]{1,10}$")


@dataclass
class FileItem:
    source_path: str
    output_name_var: tk.StringVar
    output_format_var: tk.StringVar


class UniversalConverterApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Universal File Converter (ffmpeg)")
        self.geometry("1050x650")
        self.minsize(900, 540)

        self.items: list[FileItem] = []
        self.destination_var = tk.StringVar()
        self.status_var = tk.StringVar(value="Ready.")
        self.current_file_progress_var = tk.DoubleVar(value=0.0)
        self.total_progress_var = tk.DoubleVar(value=0.0)
        self.current_file_text_var = tk.StringVar(value="Current file: -")
        self.total_progress_text_var = tk.StringVar(value="Total progress: 0.0%")

        self._build_ui()

    def _build_ui(self) -> None:
        main = ttk.Frame(self, padding=14)
        main.pack(fill="both", expand=True)

        controls = ttk.Frame(main)
        controls.pack(fill="x")

        ttk.Button(
            controls,
            text="Select files",
            command=self.select_files,
        ).pack(side="left")

        ttk.Button(
            controls,
            text="Clear list",
            command=self.clear_files,
        ).pack(side="left", padx=(8, 0))

        destination_frame = ttk.LabelFrame(main, text="Destination folder", padding=10)
        destination_frame.pack(fill="x", pady=(12, 10))

        ttk.Entry(destination_frame, textvariable=self.destination_var).pack(
            side="left", fill="x", expand=True
        )
        ttk.Button(
            destination_frame,
            text="Choose folder",
            command=self.select_destination,
        ).pack(side="left", padx=(8, 0))

        files_frame = ttk.LabelFrame(
            main,
            text="Selected files and output settings",
            padding=10,
        )
        files_frame.pack(fill="both", expand=True)

        self.canvas = tk.Canvas(files_frame, highlightthickness=0)
        self.canvas.pack(side="left", fill="both", expand=True)

        scrollbar = ttk.Scrollbar(files_frame, orient="vertical", command=self.canvas.yview)
        scrollbar.pack(side="right", fill="y")
        self.canvas.configure(yscrollcommand=scrollbar.set)

        self.rows_frame = ttk.Frame(self.canvas)
        self.canvas_window = self.canvas.create_window(
            (0, 0),
            window=self.rows_frame,
            anchor="nw",
        )

        self.rows_frame.bind("<Configure>", self._on_rows_configure)
        self.canvas.bind("<Configure>", self._on_canvas_configure)

        self.rows_frame.grid_columnconfigure(0, weight=5)
        self.rows_frame.grid_columnconfigure(1, weight=3)
        self.rows_frame.grid_columnconfigure(2, weight=2)

        ttk.Label(self.rows_frame, text="Source file", anchor="w").grid(
            row=0,
            column=0,
            sticky="ew",
            padx=(0, 10),
            pady=(0, 6),
        )
        ttk.Label(self.rows_frame, text="Output name", anchor="w").grid(
            row=0,
            column=1,
            sticky="ew",
            padx=(0, 10),
            pady=(0, 6),
        )
        ttk.Label(self.rows_frame, text="Output format", anchor="w").grid(
            row=0,
            column=2,
            sticky="ew",
            pady=(0, 6),
        )

        bottom = ttk.Frame(main)
        bottom.pack(fill="x", pady=(10, 0))

        self.convert_button = ttk.Button(bottom, text="Convert files", command=self.start_conversion)
        self.convert_button.pack(side="right")

        ttk.Label(bottom, textvariable=self.status_var, anchor="w").pack(side="left", fill="x", expand=True)

        progress_frame = ttk.LabelFrame(main, text="Progress", padding=10)
        progress_frame.pack(fill="x", pady=(10, 0))

        ttk.Label(progress_frame, textvariable=self.current_file_text_var, anchor="w").pack(fill="x")
        self.current_file_progress = ttk.Progressbar(
            progress_frame,
            variable=self.current_file_progress_var,
            maximum=100,
            mode="determinate",
        )
        self.current_file_progress.pack(fill="x", pady=(4, 8))

        ttk.Label(progress_frame, textvariable=self.total_progress_text_var, anchor="w").pack(fill="x")
        self.total_progress = ttk.Progressbar(
            progress_frame,
            variable=self.total_progress_var,
            maximum=100,
            mode="determinate",
        )
        self.total_progress.pack(fill="x", pady=(4, 0))

    def _on_rows_configure(self, _event: tk.Event) -> None:
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def _on_canvas_configure(self, event: tk.Event) -> None:
        self.canvas.itemconfig(self.canvas_window, width=event.width)

    def _render_rows(self) -> None:
        for widget in self.rows_frame.grid_slaves():
            row = int(widget.grid_info().get("row", 0))
            if row > 0:
                widget.destroy()

        for index, item in enumerate(self.items, start=1):
            ttk.Label(self.rows_frame, text=item.source_path, anchor="w").grid(
                row=index,
                column=0,
                sticky="ew",
                padx=(0, 10),
                pady=3,
            )
            ttk.Entry(self.rows_frame, textvariable=item.output_name_var).grid(
                row=index,
                column=1,
                sticky="ew",
                padx=(0, 10),
                pady=3,
            )
            ttk.Combobox(
                self.rows_frame,
                textvariable=item.output_format_var,
                values=OUTPUT_FORMAT_SUGGESTIONS,
                state="normal",
            ).grid(
                row=index,
                column=2,
                sticky="ew",
                pady=3,
            )

    def select_files(self) -> None:
        selected = filedialog.askopenfilenames(
            title="Select source files",
            filetypes=FILE_FILTERS,
        )
        if not selected:
            return

        existing = {item.source_path for item in self.items}
        added = 0

        for file_path in selected:
            if file_path in existing:
                continue

            stem = Path(file_path).stem
            self.items.append(
                FileItem(
                    source_path=file_path,
                    output_name_var=tk.StringVar(value=stem),
                    output_format_var=tk.StringVar(value="ogg"),
                )
            )
            existing.add(file_path)
            added += 1

        self._render_rows()
        self.status_var.set(f"Added {added} file(s). Total: {len(self.items)}")

    def clear_files(self) -> None:
        if not self.items:
            return

        self.items.clear()
        self._render_rows()
        self.status_var.set("List cleared.")

    def select_destination(self) -> None:
        folder = filedialog.askdirectory(title="Select destination folder")
        if folder:
            self.destination_var.set(folder)

    def start_conversion(self) -> None:
        if not self.items:
            messagebox.showerror("No files", "Select at least one audio file.")
            return

        destination = self.destination_var.get().strip()
        if not destination:
            messagebox.showerror("Missing destination", "Choose a destination folder.")
            return

        if not os.path.isdir(destination):
            messagebox.showerror("Invalid folder", "The selected destination folder does not exist.")
            return

        if shutil.which("ffmpeg") is None:
            messagebox.showerror(
                "ffmpeg not found",
                "ffmpeg is not available in PATH. Install ffmpeg and restart the app.",
            )
            return

        snapshot: list[tuple[str, str, str]] = []
        for item in self.items:
            output_extension = self._normalize_extension(item.output_format_var.get())
            if output_extension is None:
                messagebox.showerror(
                    "Invalid output format",
                    f"Invalid extension for file:\n{item.source_path}\n\nUse only letters and numbers (example: mp3, wav, mp4).",
                )
                return

            snapshot.append((item.source_path, item.output_name_var.get(), output_extension))

        total = len(snapshot)

        self.convert_button.configure(state="disabled")
        self.status_var.set("Starting conversion...")
        self._update_progress(0.0, 0.0, total, "Waiting...")

        worker = threading.Thread(
            target=self._convert_worker,
            args=(snapshot, destination),
            daemon=True,
        )
        worker.start()

    def _normalize_name(self, raw_name: str, fallback: str) -> str:
        clean = raw_name.strip()
        if "." in clean and not clean.endswith("."):
            possible_base, possible_extension = clean.rsplit(".", 1)
            if VALID_EXTENSION_CHARS.fullmatch(possible_extension.lower()):
                clean = possible_base

        clean = INVALID_FILENAME_CHARS.sub("_", clean)
        clean = clean.strip(" .")
        return clean or fallback

    def _normalize_extension(self, raw_extension: str) -> str | None:
        clean = raw_extension.strip().lower()
        if clean.startswith("."):
            clean = clean[1:]

        if not clean:
            return None

        if not VALID_EXTENSION_CHARS.fullmatch(clean):
            return None

        return clean

    def _build_unique_output_path(
        self,
        destination: str,
        base_name: str,
        extension: str,
        used_names: set[str],
    ) -> str:
        candidate = base_name
        suffix = 2

        while True:
            output_path = os.path.join(destination, f"{candidate}.{extension}")
            key = f"{candidate}.{extension}".casefold()

            if key not in used_names and not os.path.exists(output_path):
                used_names.add(key)
                return output_path

            candidate = f"{base_name}_{suffix}"
            suffix += 1

    def _update_progress(self, file_percent: float, completed_files: float, total_files: int, current_file: str) -> None:
        clamped_file_percent = max(0.0, min(100.0, file_percent))
        safe_completed = max(0.0, min(float(total_files), completed_files))
        total_percent = (safe_completed / total_files * 100.0) if total_files else 0.0

        self.current_file_progress_var.set(clamped_file_percent)
        self.total_progress_var.set(total_percent)
        self.current_file_text_var.set(f"Current file: {current_file} ({clamped_file_percent:.1f}%)")
        self.total_progress_text_var.set(
            f"Total progress: {total_percent:.1f}% ({safe_completed:.2f}/{total_files} files)"
        )

    def _probe_duration_seconds(self, source: str) -> float | None:
        command = [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nokey=1:noprint_wrappers=1",
            source,
        ]

        try:
            result = subprocess.run(command, capture_output=True, text=True, check=False)
        except Exception:  # noqa: BLE001
            return None

        if result.returncode != 0:
            return None

        try:
            duration = float(result.stdout.strip())
        except ValueError:
            return None

        return duration if duration > 0 else None

    def _parse_ffmpeg_timestamp(self, value: str) -> float | None:
        parts = value.strip().split(":")
        if len(parts) != 3:
            return None

        try:
            hours = float(parts[0])
            minutes = float(parts[1])
            seconds = float(parts[2])
        except ValueError:
            return None

        return hours * 3600.0 + minutes * 60.0 + seconds

    def _run_ffmpeg_with_progress(
        self,
        source: str,
        output_path: str,
        duration_seconds: float | None,
        index: int,
        total: int,
        source_name: str,
    ) -> tuple[bool, str | None]:
        command = [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            source,
            "-progress",
            "pipe:1",
            "-nostats",
            output_path,
        ]

        try:
            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                universal_newlines=True,
            )
        except Exception as exc:  # noqa: BLE001
            return False, str(exc)

        logs: list[str] = []
        if process.stdout is not None:
            for raw_line in process.stdout:
                line = raw_line.strip()
                if not line:
                    continue

                key, _, value = line.partition("=")
                if _ and key == "out_time" and duration_seconds:
                    current_seconds = self._parse_ffmpeg_timestamp(value)
                    if current_seconds is not None:
                        file_percent = min(100.0, (current_seconds / duration_seconds) * 100.0)
                        completed_files = (index - 1) + (file_percent / 100.0)
                        self.after(0, self._update_progress, file_percent, completed_files, total, source_name)
                    continue

                if _ and key == "progress" and value == "end":
                    self.after(0, self._update_progress, 100.0, float(index), total, source_name)
                    continue

                logs.append(line)

        return_code = process.wait()
        if return_code == 0:
            return True, None

        if logs:
            return False, logs[-1]

        return False, "ffmpeg failed"

    def _convert_worker(self, snapshot: list[tuple[str, str, str]], destination: str) -> None:
        total = len(snapshot)
        used_names: set[str] = set()
        successful: list[str] = []
        failed: list[str] = []

        for index, (source, custom_name, output_extension) in enumerate(snapshot, start=1):
            source_name = Path(source).name
            self.after(0, self.status_var.set, f"Converting {index}/{total}: {source_name} -> .{output_extension}")
            self.after(0, self._update_progress, 0.0, float(index - 1), total, source_name)

            if not os.path.isfile(source):
                failed.append(f"{source_name}: source file not found")
                self.after(0, self._update_progress, 100.0, float(index), total, source_name)
                continue

            fallback_name = Path(source).stem
            output_name = self._normalize_name(custom_name, fallback_name)
            output_path = self._build_unique_output_path(destination, output_name, output_extension, used_names)

            duration_seconds = self._probe_duration_seconds(source)
            ok, error_message = self._run_ffmpeg_with_progress(
                source,
                output_path,
                duration_seconds,
                index,
                total,
                source_name,
            )

            self.after(0, self._update_progress, 100.0, float(index), total, source_name)
            if ok:
                successful.append(output_path)
            else:
                message = error_message or "ffmpeg failed"
                failed.append(f"{source_name}: {message}")

        self.after(0, self._finish_conversion, successful, failed, total)

    def _finish_conversion(self, successful: list[str], failed: list[str], total: int) -> None:
        self.convert_button.configure(state="normal")

        if failed:
            details = "\n".join(failed[:12])
            if len(failed) > 12:
                details += f"\n... and {len(failed) - 12} more error(s)."

            messagebox.showwarning(
                "Conversion finished with errors",
                f"Total: {total}\nSuccess: {len(successful)}\nFailed: {len(failed)}\n\n{details}",
            )
            self.status_var.set(f"Finished with errors. Success: {len(successful)}, Failed: {len(failed)}")
            return

        messagebox.showinfo(
            "Conversion complete",
            f"Successfully converted {len(successful)} file(s).",
        )
        self.status_var.set(f"Done. Converted {len(successful)} file(s).")


def main() -> None:
    app = UniversalConverterApp()
    app.mainloop()


if __name__ == "__main__":
    main()
