import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import {
  Quicksand_400Regular,
  Quicksand_700Bold,
  useFonts
} from '@expo-google-fonts/quicksand'

const RECIPES = [
  {
    id: '1',
    title: 'Pasta cremosa de tomate',
    category: 'Rapidas',
    time: '35 min',
    level: 'Facil',
    servings: '2 porciones',
    color: ['#ff9966', '#ff5e62'],
    utensils: ['1 olla mediana', '1 sarten grande', 'colador', 'cuchara de madera'],
    ingredients: [
      '220g pasta corta (penne o fusilli)',
      '1 cda aceite de oliva',
      '1/4 cebolla picada fina',
      '1 diente de ajo picado',
      '1 1/2 tazas salsa de tomate natural',
      '1/3 taza crema de leche o media crema',
      '2 cdas queso crema',
      '1/4 taza queso parmesano rallado',
      '1/2 cdta oregano seco',
      'sal y pimienta al gusto',
      'hojas de albahaca para terminar'
    ],
    steps: [
      'Hierve agua con sal en una olla y cocina la pasta 1 minuto menos de lo que indica el paquete.',
      'Guarda 1/2 taza del agua de coccion y escurre la pasta.',
      'En un sarten grande calienta el aceite y sofrie cebolla durante 2 minutos a fuego medio.',
      'Agrega el ajo y cocina 30 segundos sin dejar que se queme.',
      'Incorpora la salsa de tomate, oregano, sal y pimienta. Cocina 4 minutos para concentrar sabor.',
      'Baja el fuego, agrega crema y queso crema. Mezcla hasta que la salsa quede lisa y brillante.',
      'Suma la pasta al sarten junto con un poco de agua de coccion para emulsionar.',
      'Apaga el fuego, agrega parmesano, mezcla bien y sirve con albahaca fresca.'
    ],
    tips: [
      'Si la salsa queda muy espesa, agrega 1 o 2 cucharadas extras de agua de coccion.',
      'Puedes agregar pollo en cubos dorado al final para version mas completa.'
    ],
    substitutions: [
      'Crema de leche por yogurt griego natural (agregar fuera del fuego).',
      'Parmesano por queso manchego rallado fino.'
    ]
  },
  {
    id: '2',
    title: 'Ensalada pollo crunch',
    category: 'Fit',
    time: '25 min',
    level: 'Facil',
    servings: '2 porciones',
    color: ['#56ab2f', '#a8e063'],
    utensils: ['tabla de picar', 'cuchillo afilado', 'bowl grande', 'frasco para aderezo'],
    ingredients: [
      '2 tazas lechuga romana troceada',
      '1 taza espinaca baby',
      '250g pechuga de pollo cocida y desmenuzada',
      '1/2 pepino en medias lunas finas',
      '1 zanahoria rallada',
      '1/4 cebolla morada en pluma fina',
      '2 cdas semillas de girasol o almendras laminadas',
      '1 cda aceite de oliva',
      'jugo de 1 limon',
      '1 cdta mostaza',
      '1 cdta miel',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Lava y desinfecta todos los vegetales. Seca muy bien para evitar ensalada aguada.',
      'Corta lechuga y espinaca en trozos medianos y colocalos en un bowl grande.',
      'Agrega pepino, zanahoria y cebolla morada distribuyendo por capas.',
      'Incorpora el pollo cocido ya frio para mantener frescura y textura.',
      'Tuesta ligeramente semillas o almendras en sarten seco durante 1 minuto.',
      'En un frasco mezcla limon, aceite, mostaza, miel, sal y pimienta hasta emulsionar.',
      'Vierte el aderezo justo antes de servir para no perder crocancia.',
      'Mezcla suave con pinzas y termina con las semillas tostadas encima.'
    ],
    tips: [
      'Para meal prep, guarda aderezo aparte y mezcla al momento de comer.',
      'Si quieres mas proteina agrega garbanzos cocidos o huevo cocido.'
    ],
    substitutions: [
      'Pollo por atun en agua escurrido.',
      'Miel por stevia liquida (3 a 4 gotas).'
    ]
  },
  {
    id: '3',
    title: 'Tacos de frijol y queso',
    category: 'Mex',
    time: '30 min',
    level: 'Facil',
    servings: '3 porciones (6 tacos)',
    color: ['#f7971e', '#ffd200'],
    utensils: ['sarten antiadherente', 'espatula', 'comal o plancha', 'bowl pequeno'],
    ingredients: [
      '6 tortillas de maiz medianas',
      '1 1/2 tazas frijoles refritos',
      '3/4 taza queso rallado (oaxaca o manchego)',
      '1/2 taza pico de gallo',
      '1/4 aguacate en laminas',
      '1 cda aceite vegetal',
      '1 pizca comino en polvo',
      'sal al gusto',
      'salsa verde o roja para servir'
    ],
    steps: [
      'Calienta los frijoles en sarten con comino y una pizca de sal hasta que esten cremosos.',
      'En otra superficie calienta tortillas en comal 20 segundos por lado para hacerlas flexibles.',
      'Unta una capa generosa de frijoles sobre media tortilla.',
      'Agrega queso rallado y dobla cada tortilla formando media luna.',
      'Pincela el sarten antiadherente con aceite y cocina tacos 2 a 3 minutos por lado.',
      'Presiona suavemente con espatula para que queden dorados y crujientes.',
      'Retira y deja reposar 1 minuto sobre rejilla o plato.',
      'Sirve con pico de gallo, aguacate y salsa al gusto.'
    ],
    tips: [
      'Si se rompen tortillas, humedecelas con unas gotas de agua antes de calentarlas.',
      'El queso se derrite mejor si esta a temperatura ambiente.'
    ],
    substitutions: [
      'Frijoles refritos por pure de lentejas espeso.',
      'Queso manchego por mezcla vegana rallada.'
    ]
  },
  {
    id: '4',
    title: 'Bowl de yogurt y fruta',
    category: 'Fit',
    time: '12 min',
    level: 'Muy facil',
    servings: '1 porcion grande',
    color: ['#36d1dc', '#5b86e5'],
    utensils: ['bowl hondo', 'cuchillo pequeno', 'cuchara'],
    ingredients: [
      '1 taza yogurt griego natural',
      '4 fresas en cubos',
      '1/2 platano en rodajas',
      '1/2 taza fruta extra (mango, kiwi o manzana)',
      '3 cdas granola artesanal',
      '1 cda semillas de chia',
      '1 cda miel o jarabe de agave',
      'canela en polvo al gusto',
      '1 cda crema de cacahuate (opcional)'
    ],
    steps: [
      'Coloca el yogurt en el bowl y alisa la superficie con una cuchara.',
      'Lava, desinfecta y corta la fruta en piezas pequenas de tamano uniforme.',
      'Distribuye las frutas por secciones para una mejor presentacion y balance de sabor.',
      'Agrega la granola por encima en el ultimo momento para mantener crocante.',
      'Espolvorea semillas de chia y una pizca de canela.',
      'Termina con hilo de miel y, si quieres mas energia, una cucharada de crema de cacahuate.'
    ],
    tips: [
      'Si lo preparas para llevar, pon granola y miel en un contenedor aparte.',
      'Deja el platano al final para evitar oxidacion.'
    ],
    substitutions: [
      'Yogurt griego por yogurt vegetal de coco o almendra.',
      'Miel por fruta licuada espesa para endulzar natural.'
    ]
  },
  {
    id: '5',
    title: 'Arroz frito de pollo casero',
    category: 'Rapidas',
    time: '30 min',
    level: 'Facil',
    servings: '3 porciones',
    color: ['#f6d365', '#fda085'],
    utensils: ['wok o sarten grande', 'espatula', 'bowl pequeno', 'cuchillo'],
    ingredients: [
      '2 tazas arroz cocido frio del dia anterior',
      '220g pollo en cubos pequenos',
      '2 huevos',
      '1/2 taza zanahoria en cubitos',
      '1/2 taza chicharos cocidos',
      '2 cebollines picados',
      '2 cdas salsa de soya baja en sodio',
      '1 cdta aceite de sesamo',
      '1 cda aceite vegetal',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Sazona el pollo con sal y pimienta y reserva mientras preparas el resto.',
      'Bate los huevos en un bowl con pizca de sal.',
      'Calienta el wok con aceite vegetal y cocina el pollo hasta dorar completamente.',
      'Empuja el pollo a un lado y cocina el huevo revuelto en el espacio libre.',
      'Agrega zanahoria y chicharos, saltea 2 minutos para mantener textura.',
      'Incorpora el arroz frio separando grumos con la espatula.',
      'Anade salsa de soya, aceite de sesamo y cebollin, mezcla 1 minuto a fuego alto.',
      'Prueba sazones y sirve caliente con cebollin extra por encima.'
    ],
    tips: [
      'El arroz frio funciona mejor porque queda suelto y no se bate.',
      'No llenes demasiado el sarten para que realmente se saltee y no se cueza al vapor.'
    ],
    substitutions: [
      'Pollo por tofu firme dorado en cubos.',
      'Salsa de soya por tamari si prefieres opcion sin gluten.'
    ]
  },
  {
    id: '6',
    title: 'Salmon al horno con verduras',
    category: 'Fit',
    time: '40 min',
    level: 'Intermedio',
    servings: '2 porciones',
    color: ['#84fab0', '#8fd3f4'],
    utensils: ['charola para horno', 'papel aluminio', 'brocha de cocina', 'cuchillo'],
    ingredients: [
      '2 filetes de salmon de 170g',
      '1 calabacita en medias lunas',
      '1 pimiento rojo en tiras',
      '1/2 cebolla morada en pluma',
      '1 taza brocoli en floretes pequenos',
      '2 cdas aceite de oliva',
      '1 limon (jugo y ralladura)',
      '1 diente de ajo rallado',
      '1/2 cdta paprika',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Precalienta el horno a 200 C y forra una charola con papel aluminio.',
      'Coloca verduras en la charola, agrega 1 cda de aceite, sal y pimienta.',
      'Hornea verduras 12 minutos para darles coccion inicial.',
      'Mezcla en un bowl aceite restante, jugo de limon, ralladura, ajo y paprika.',
      'Sazona el salmon con sal y pimienta y pincela con la mezcla preparada.',
      'Retira charola, acomoda el salmon sobre las verduras y hornea 12 a 15 minutos.',
      'Comprueba coccion: el salmon debe deshojarse facilmente con un tenedor.',
      'Sirve al momento con jugo de limon adicional.'
    ],
    tips: [
      'No sobrecocines el salmon para que quede jugoso.',
      'Corta verduras de tamano similar para coccion pareja.'
    ],
    substitutions: [
      'Salmon por filete de trucha o tilapia gruesa.',
      'Brocoli por esparragos en trozos.'
    ]
  },
  {
    id: '7',
    title: 'Enchiladas verdes de pollo',
    category: 'Mex',
    time: '45 min',
    level: 'Intermedio',
    servings: '4 porciones',
    color: ['#a8e063', '#56ab2f'],
    utensils: ['olla mediana', 'licuadora', 'sarten', 'charola de servicio'],
    ingredients: [
      '10 tortillas de maiz',
      '2 tazas pollo cocido deshebrado',
      '500g tomate verde',
      '1/4 cebolla blanca',
      '1 diente de ajo',
      '1 chile serrano (opcional)',
      '1/2 taza cilantro',
      '1 taza caldo de pollo',
      '1 cda aceite',
      '1/2 taza crema',
      '1/2 taza queso fresco desmoronado',
      'sal al gusto'
    ],
    steps: [
      'Hierve tomates verdes con chile durante 8 minutos hasta que cambien de color.',
      'Licua tomates con cebolla, ajo, cilantro y caldo de pollo hasta obtener salsa lisa.',
      'Calienta aceite en olla y cocina la salsa 8 minutos, ajusta sal al gusto.',
      'Calienta tortillas en comal para que sean flexibles y no se rompan.',
      'Rellena cada tortilla con pollo deshebrado y enrolla como taco.',
      'Bana las enchiladas con salsa verde caliente.',
      'Termina con crema y queso fresco por encima.',
      'Sirve de inmediato con cebolla en pluma si lo deseas.'
    ],
    tips: [
      'Si prefieres menos picante, omite el chile serrano.',
      'La salsa mejora si la dejas reposar 5 minutos antes de servir.'
    ],
    substitutions: [
      'Pollo por queso panela desmoronado para version vegetariana.',
      'Crema regular por yogurt natural espeso.'
    ]
  },
  {
    id: '8',
    title: 'Sopa espesa de lentejas',
    category: 'Rapidas',
    time: '38 min',
    level: 'Facil',
    servings: '4 porciones',
    color: ['#c79081', '#dfa579'],
    utensils: ['olla grande', 'cuchillo', 'tabla', 'cucharon'],
    ingredients: [
      '1 1/2 tazas lentejas lavadas',
      '1 zanahoria en cubos',
      '1 papa pequena en cubos',
      '1/4 cebolla picada',
      '1 diente de ajo picado',
      '1 jitomate picado',
      '1 hoja de laurel',
      '1 cda aceite',
      '6 tazas agua o caldo',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Enjuaga lentejas hasta que el agua salga clara.',
      'Sofrie cebolla y ajo en la olla con aceite durante 2 minutos.',
      'Agrega jitomate y cocina 3 minutos hasta que se deshaga ligeramente.',
      'Incorpora lentejas, zanahoria, papa y hoja de laurel.',
      'Anade agua o caldo y lleva a ebullicion.',
      'Baja fuego, tapa parcialmente y cocina 25 minutos.',
      'Ajusta sal y pimienta, y cocina 5 minutos extra para integrar sabor.',
      'Sirve caliente con unas gotas de limon.'
    ],
    tips: [
      'Si la quieres mas cremosa, machaca una porcion de lentejas al final.',
      'Retira la hoja de laurel antes de servir.'
    ],
    substitutions: [
      'Papa por calabaza en cubos.',
      'Lenteja pardina por lenteja roja (cocina menos tiempo).'
    ]
  },
  {
    id: '9',
    title: 'Tortilla de claras y espinaca',
    category: 'Fit',
    time: '20 min',
    level: 'Facil',
    servings: '1 porcion grande',
    color: ['#6dd5ed', '#2193b0'],
    utensils: ['sarten antiadherente', 'espatula', 'bowl', 'batidor'],
    ingredients: [
      '5 claras de huevo',
      '1 huevo entero',
      '1 taza espinaca picada',
      '1/4 cebolla picada fina',
      '1/4 taza champinones en laminas',
      '2 cdas queso rallado ligero',
      '1 cdta aceite de oliva',
      'sal, pimienta y oregano al gusto'
    ],
    steps: [
      'Bate claras con huevo entero, sal, pimienta y oregano hasta integrar.',
      'Calienta sarten con aceite y sofrie cebolla y champinones 3 minutos.',
      'Agrega espinaca y cocina 1 minuto hasta que reduzca volumen.',
      'Vierte la mezcla de huevo y mueve suavemente para repartir verduras.',
      'Cocina a fuego bajo hasta que la base este firme.',
      'Espolvorea queso y dobla la tortilla con cuidado.',
      'Cocina 1 minuto extra para fundir queso y retira del fuego.',
      'Sirve con ensalada fresca o tostadas integrales.'
    ],
    tips: [
      'Usa fuego bajo para evitar que se seque.',
      'Puedes cubrir con tapa 1 minuto para coccion mas uniforme.'
    ],
    substitutions: [
      'Champinones por calabacita rallada escurrida.',
      'Queso ligero por queso cottage.'
    ]
  },
  {
    id: '10',
    title: 'Chilaquiles rojos ligeros',
    category: 'Mex',
    time: '28 min',
    level: 'Facil',
    servings: '2 porciones',
    color: ['#f46b45', '#eea849'],
    utensils: ['licuadora', 'sarten amplio', 'comal', 'cuchillo'],
    ingredients: [
      '8 tortillas de maiz en triangulos',
      '3 jitomates maduros',
      '1/4 cebolla',
      '1 diente de ajo',
      '1 chile guajillo hidratado',
      '1/2 taza agua o caldo',
      '1 cdta aceite',
      '1/2 taza pollo deshebrado (opcional)',
      '2 cdas crema',
      '2 cdas queso fresco',
      '1/4 aguacate en rebanadas',
      'sal al gusto'
    ],
    steps: [
      'Tuesta triangulos de tortilla en comal hasta que queden crujientes.',
      'Licúa jitomate, cebolla, ajo, chile hidratado y agua hasta obtener salsa suave.',
      'Cuela salsa si deseas textura mas fina.',
      'Cocina la salsa en sarten con aceite durante 6 minutos y ajusta sal.',
      'Agrega pollo deshebrado si lo vas a usar y cocina 1 minuto.',
      'Incorpora totopos, mezcla rapido para cubrir sin remojar demasiado.',
      'Apaga fuego cuando aun conserven algo de crocante.',
      'Sirve con crema, queso fresco y aguacate.'
    ],
    tips: [
      'Si prefieres mas crujientes, agrega totopos por tandas al servir.',
      'Controla picante retirando semillas del guajillo.'
    ],
    substitutions: [
      'Pollo por frijoles bayos cocidos.',
      'Crema por yogurt natural sin azucar.'
    ]
  },
  {
    id: '11',
    title: 'Curry rapido de garbanzo',
    category: 'Rapidas',
    time: '32 min',
    level: 'Intermedio',
    servings: '3 porciones',
    color: ['#f6d365', '#fda085'],
    utensils: ['olla mediana', 'cuchara de madera', 'cuchillo', 'tabla'],
    ingredients: [
      '2 tazas garbanzo cocido escurrido',
      '1/2 cebolla picada',
      '1 diente de ajo picado',
      '1 cdta jengibre rallado',
      '1 taza tomate triturado',
      '3/4 taza leche de coco',
      '1 cdta curry en polvo',
      '1/2 cdta curcuma',
      '1 cda aceite',
      'sal al gusto',
      'cilantro picado para terminar'
    ],
    steps: [
      'Calienta aceite en olla y sofrie cebolla 3 minutos a fuego medio.',
      'Agrega ajo y jengibre, cocina 40 segundos moviendo constantemente.',
      'Incorpora curry y curcuma para abrir aromas durante 20 segundos.',
      'Anade tomate triturado y cocina 5 minutos hasta espesar ligeramente.',
      'Agrega garbanzos y mezcla para cubrir con la salsa.',
      'Vierte leche de coco y cocina 10 minutos a fuego bajo.',
      'Ajusta sal y textura con un poco de agua si hace falta.',
      'Sirve con cilantro picado y arroz blanco.'
    ],
    tips: [
      'Si quieres mas cuerpo, aplasta algunos garbanzos dentro de la olla.',
      'El sabor mejora al reposar 5 minutos antes de servir.'
    ],
    substitutions: [
      'Leche de coco por crema vegetal para cocinar.',
      'Garbanzos por mezcla de garbanzo y coliflor cocida.'
    ]
  },
  {
    id: '12',
    title: 'Wraps de lechuga con atun',
    category: 'Fit',
    time: '18 min',
    level: 'Muy facil',
    servings: '2 porciones',
    color: ['#43cea2', '#185a9d'],
    utensils: ['bowl mediano', 'cuchillo', 'cuchara', 'tabla'],
    ingredients: [
      '1 lata atun en agua escurrido',
      '8 hojas grandes de lechuga romana',
      '1/4 pepino en cubos pequenos',
      '1/4 pimiento rojo en cubos',
      '2 cdas yogurt natural',
      '1 cdta mostaza',
      '1 cdta jugo de limon',
      '1 cda cebollin picado',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Lava y seca muy bien las hojas de lechuga para evitar que se rompan.',
      'En un bowl mezcla atun, pepino, pimiento y cebollin.',
      'Agrega yogurt, mostaza, limon, sal y pimienta, integra hasta obtener relleno cremoso.',
      'Prueba sazon y corrige con limon o sal segun preferencia.',
      'Coloca porciones del relleno en el centro de cada hoja.',
      'Dobla laterales y enrolla como taco suave o mini wrap.',
      'Acomoda en plato de servicio con relleno hacia arriba.',
      'Sirve frio con gotas de limon adicional.'
    ],
    tips: [
      'Secar la lechuga con papel de cocina mejora mucho la textura final.',
      'Puedes mantener el relleno frio 1 dia en refrigeracion.'
    ],
    substitutions: [
      'Atun por pollo cocido desmenuzado.',
      'Yogurt por aguacate machacado para version sin lacteos.'
    ]
  },
  {
    id: '13',
    title: 'Lasana rapida de sarten',
    category: 'Rapidas',
    time: '38 min',
    level: 'Intermedio',
    servings: '4 porciones',
    color: ['#f7797d', '#fbd786'],
    utensils: ['sarten profundo con tapa', 'cuchara de madera', 'cuchillo', 'tabla'],
    ingredients: [
      '250g carne molida de res o pavo',
      '1/2 cebolla picada',
      '1 diente de ajo picado',
      '2 tazas salsa de tomate',
      '8 laminas de pasta para lasana precocida en trozos',
      '1 taza agua caliente',
      '1 taza queso mozzarella rallado',
      '1/4 taza queso parmesano',
      '1 cdta oregano seco',
      '1 cda aceite',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Calienta aceite en sarten profundo y sofrie cebolla con ajo por 2 minutos.',
      'Agrega carne molida y cocina hasta dorar, rompiendo grumos con cuchara.',
      'Sazona con sal, pimienta y oregano para base de sabor.',
      'Vierte salsa de tomate y agua caliente, mezcla hasta integrar.',
      'Incorpora trozos de pasta repartiendo por toda la salsa.',
      'Tapa y cocina a fuego medio-bajo 12 a 15 minutos hasta que la pasta este suave.',
      'Agrega mozzarella y parmesano, vuelve a tapar 3 minutos para fundir.',
      'Deja reposar 5 minutos antes de servir para que tome cuerpo.'
    ],
    tips: [
      'Si la salsa seca demasiado, agrega un poco mas de agua caliente.',
      'Reposar unos minutos mejora mucho la textura al servir.'
    ],
    substitutions: [
      'Carne por soya texturizada hidratada.',
      'Mozzarella por queso Oaxaca deshebrado.'
    ]
  },
  {
    id: '14',
    title: 'Bowl de quinoa mediterraneo',
    category: 'Fit',
    time: '35 min',
    level: 'Facil',
    servings: '3 porciones',
    color: ['#89f7fe', '#66a6ff'],
    utensils: ['olla pequena', 'colador fino', 'bowl grande', 'cuchillo'],
    ingredients: [
      '1 taza quinoa cruda',
      '2 tazas agua',
      '1 taza pepino en cubos',
      '1 taza jitomate cherry en mitades',
      '1/3 taza aceitunas negras en rodajas',
      '1/4 cebolla morada en pluma fina',
      '1/2 taza garbanzo cocido',
      '1/3 taza queso feta desmoronado',
      '2 cdas aceite de oliva',
      '1 limon (jugo)',
      'sal, pimienta y oregano al gusto'
    ],
    steps: [
      'Enjuaga quinoa en colador fino por 1 minuto para retirar amargor natural.',
      'Cocina quinoa con agua en olla, tapa y deja 14 minutos a fuego bajo.',
      'Apaga, reposa 5 minutos y esponja con tenedor.',
      'Pasa quinoa a bowl amplio para que enfrie mas rapido.',
      'Agrega pepino, jitomate, cebolla morada, aceitunas y garbanzos.',
      'Mezcla aceite, jugo de limon, oregano, sal y pimienta para aderezo.',
      'Vierte aderezo y mezcla suavemente hasta cubrir todo.',
      'Sirve con queso feta por encima y pimienta recien molida.'
    ],
    tips: [
      'Queda excelente frio, ideal para meal prep.',
      'Puedes agregar hojas de menta o perejil para frescura extra.'
    ],
    substitutions: [
      'Queso feta por panela en cubos.',
      'Garbanzo por frijol blanco cocido.'
    ]
  },
  {
    id: '15',
    title: 'Pozole rojo express',
    category: 'Mex',
    time: '50 min',
    level: 'Intermedio',
    servings: '4 porciones',
    color: ['#ed213a', '#93291e'],
    utensils: ['olla grande', 'licuadora', 'sarten', 'colador'],
    ingredients: [
      '700g maiz pozolero precocido escurrido',
      '350g pollo cocido deshebrado',
      '3 chiles guajillo hidratados',
      '1 chile ancho hidratado',
      '2 jitomates asados',
      '1/4 cebolla',
      '1 diente de ajo',
      '5 tazas caldo de pollo',
      '1 cda aceite',
      'sal al gusto',
      'lechuga, rabano y oregano para servir'
    ],
    steps: [
      'Lava el maiz pozolero y colocalo en olla con caldo caliente.',
      'Licua chiles hidratados con jitomate, cebolla, ajo y un poco de caldo.',
      'Cuela la salsa para evitar pieles y semillas.',
      'En sarten con aceite, sofrie la salsa 5 minutos para concentrar sabor.',
      'Vierte salsa a la olla con maiz y mezcla bien.',
      'Agrega pollo deshebrado y cocina a fuego medio 20 minutos.',
      'Ajusta sal y revisa consistencia, agrega caldo si lo deseas mas caldoso.',
      'Sirve con lechuga, rabano y pizca de oregano seco.'
    ],
    tips: [
      'Sabe mejor si reposa unos minutos antes de servir.',
      'Puedes controlar picor quitando semillas de los chiles.'
    ],
    substitutions: [
      'Pollo por lomo de cerdo cocido deshebrado.',
      'Guajillo por chile pasilla para sabor mas ahumado.'
    ]
  },
  {
    id: '16',
    title: 'Pasta al pesto de espinaca',
    category: 'Rapidas',
    time: '28 min',
    level: 'Facil',
    servings: '2 porciones',
    color: ['#56ab2f', '#a8e063'],
    utensils: ['olla mediana', 'licuadora o procesador', 'colador', 'sarten'],
    ingredients: [
      '220g pasta larga',
      '2 tazas espinaca fresca',
      '1/4 taza nuez o almendra',
      '1/4 taza queso parmesano',
      '1 diente de ajo pequeno',
      '1/3 taza aceite de oliva',
      '2 cdas agua de coccion de pasta',
      'jugo de 1/2 limon',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Hierve pasta en agua con sal hasta punto al dente.',
      'Reserva un poco de agua de coccion y escurre pasta.',
      'Licua espinaca, nuez, ajo, parmesano, aceite y limon.',
      'Ajusta textura del pesto con agua de coccion hasta que quede cremoso.',
      'Calienta sarten a fuego bajo y agrega pasta cocida.',
      'Incorpora pesto y mezcla hasta cubrir toda la pasta.',
      'Sazona con sal y pimienta y cocina 1 minuto mas.',
      'Sirve con parmesano extra y ralladura de limon.'
    ],
    tips: [
      'No calientes demasiado el pesto para conservar color verde.',
      'Si queda espeso, agrega mas agua de coccion en cucharadas.'
    ],
    substitutions: [
      'Nuez por semilla de girasol tostada.',
      'Parmesano por levadura nutricional.'
    ]
  },
  {
    id: '17',
    title: 'Fajitas de res con pimientos',
    category: 'Mex',
    time: '34 min',
    level: 'Facil',
    servings: '3 porciones',
    color: ['#ff9966', '#ff5e62'],
    utensils: ['sarten grande', 'pinzas', 'tabla', 'cuchillo'],
    ingredients: [
      '350g bistec de res en tiras finas',
      '1 pimiento rojo en tiras',
      '1 pimiento verde en tiras',
      '1/2 cebolla en pluma',
      '1 cdta paprika',
      '1/2 cdta comino',
      '1 cda salsa inglesa',
      '1 cda aceite',
      'sal y pimienta al gusto',
      'tortillas de harina o maiz para servir'
    ],
    steps: [
      'Sazona la carne con paprika, comino, sal y pimienta.',
      'Calienta sarten con aceite a fuego alto.',
      'Sella la carne en tandas cortas para que dore y no suelte agua.',
      'Retira carne y en el mismo sarten cocina cebolla y pimientos 4 minutos.',
      'Regresa carne al sarten y agrega salsa inglesa.',
      'Mezcla todo 2 minutos para integrar sabor.',
      'Prueba sazon y corrige con sal o pimienta.',
      'Sirve caliente con tortillas y limon.'
    ],
    tips: [
      'Cortar la carne en tiras delgadas acelera coccion.',
      'No sobrecocines para evitar carne dura.'
    ],
    substitutions: [
      'Res por pechuga de pollo en tiras.',
      'Salsa inglesa por soya baja en sodio.'
    ]
  },
  {
    id: '18',
    title: 'Avena nocturna proteica',
    category: 'Fit',
    time: '10 min + reposo',
    level: 'Muy facil',
    servings: '1 porcion',
    color: ['#fbc2eb', '#a6c1ee'],
    utensils: ['frasco con tapa', 'cuchara', 'bowl pequeno'],
    ingredients: [
      '1/2 taza avena en hojuelas',
      '3/4 taza leche o bebida vegetal',
      '1/3 taza yogurt griego',
      '1 cda chía',
      '1 cda crema de cacahuate',
      '1/2 platano en rodajas',
      '1 cda miel o agave',
      'canela al gusto',
      'fruta fresca para decorar'
    ],
    steps: [
      'Mezcla en frasco la avena, chia y canela.',
      'Agrega leche, yogurt y miel, revuelve hasta integrar todo.',
      'Incorpora crema de cacahuate y mezcla para distribuir sabor.',
      'Cierra el frasco y refrigera al menos 6 horas o toda la noche.',
      'Al dia siguiente, mezcla nuevamente para aflojar textura.',
      'Agrega rodajas de platano y fruta fresca encima.',
      'Si la prefieres mas liquida, anade un chorrito de leche.',
      'Consume fria o templada segun tu preferencia.'
    ],
    tips: [
      'Prepara varios frascos para tener desayunos listos toda la semana.',
      'La chia ayuda a espesar y mejorar saciedad.'
    ],
    substitutions: [
      'Yogurt griego por yogurt de coco.',
      'Crema de cacahuate por crema de almendra.'
    ]
  },
  {
    id: '19',
    title: 'Sopa de tortilla al horno',
    category: 'Mex',
    time: '36 min',
    level: 'Intermedio',
    servings: '4 porciones',
    color: ['#f12711', '#f5af19'],
    utensils: ['olla mediana', 'charola de horno', 'licuadora', 'cucharon'],
    ingredients: [
      '4 jitomates maduros',
      '1/4 cebolla',
      '1 diente de ajo',
      '1 chile pasilla hidratado',
      '1 litro caldo de pollo',
      '6 tortillas de maiz en tiras',
      '1 cda aceite',
      '1/2 aguacate en cubos',
      '2 cdas crema',
      'queso fresco para terminar',
      'sal al gusto'
    ],
    steps: [
      'Hornea tiras de tortilla a 190 C por 10 minutos hasta dorar.',
      'Licua jitomate, cebolla, ajo y chile con un poco de caldo.',
      'Cuela mezcla y sofrie en olla con aceite durante 6 minutos.',
      'Agrega el resto del caldo y cocina 12 minutos a fuego medio.',
      'Ajusta sal y deja hervir suave para concentrar sabor.',
      'Sirve sopa caliente en platos hondos.',
      'Anade tiras de tortilla horneadas al momento para que no se ablanden.',
      'Decora con crema, queso fresco y aguacate.'
    ],
    tips: [
      'Tostar las tortillas en horno reduce grasa y mantiene crocante.',
      'Puedes hacer la base de sopa con anticipacion.'
    ],
    substitutions: [
      'Caldo de pollo por caldo vegetal.',
      'Queso fresco por panela desmoronada.'
    ]
  },
  {
    id: '20',
    title: 'Pollo al limon con arroz',
    category: 'Rapidas',
    time: '33 min',
    level: 'Facil',
    servings: '3 porciones',
    color: ['#fceabb', '#f8b500'],
    utensils: ['sarten grande', 'olla pequena', 'rallador', 'pinzas'],
    ingredients: [
      '2 pechugas de pollo en filetes',
      '1 taza arroz blanco',
      '2 tazas agua',
      '1 limon (jugo y ralladura)',
      '1 diente de ajo rallado',
      '1 cda mantequilla',
      '1 cda aceite de oliva',
      '1 cdta oregano',
      'sal y pimienta al gusto',
      'perejil picado para terminar'
    ],
    steps: [
      'Cocina arroz con agua y sal en olla hasta que quede suelto.',
      'Sazona pollo con sal, pimienta y oregano por ambos lados.',
      'Calienta sarten con aceite y dora pollo 4 minutos por lado.',
      'Retira pollo y en el mismo sarten agrega mantequilla y ajo.',
      'Incorpora jugo y ralladura de limon y cocina 1 minuto.',
      'Regresa pollo al sarten y barniza con la salsa de limon.',
      'Cocina 2 minutos mas para integrar sabores.',
      'Sirve sobre arroz blanco y termina con perejil.'
    ],
    tips: [
      'No cocines de mas el pollo para mantenerlo jugoso.',
      'Ralladura de limon al final potencia aroma fresco.'
    ],
    substitutions: [
      'Pechuga por muslo deshuesado.',
      'Arroz blanco por arroz integral cocido.'
    ]
  },
  {
    id: '21',
    title: 'Ensalada griega de garbanzo',
    category: 'Fit',
    time: '22 min',
    level: 'Facil',
    servings: '3 porciones',
    color: ['#76b852', '#8dc26f'],
    utensils: ['bowl grande', 'cuchillo', 'tabla', 'frasco pequeno'],
    ingredients: [
      '2 tazas garbanzo cocido escurrido',
      '1 taza pepino en cubos',
      '1 taza jitomate cherry en mitades',
      '1/3 taza cebolla morada en pluma fina',
      '1/3 taza aceitunas negras',
      '1/2 taza queso feta en cubos',
      '2 cdas aceite de oliva',
      '1 cda vinagre de vino tinto',
      '1/2 cdta oregano seco',
      'sal y pimienta al gusto'
    ],
    steps: [
      'Coloca garbanzos en bowl y agrega pepino, jitomate y cebolla.',
      'Anade aceitunas y queso feta con movimiento suave para no romperlo.',
      'En frasco mezcla aceite, vinagre, oregano, sal y pimienta.',
      'Agita hasta emulsionar aderezo.',
      'Vierte aderezo sobre la ensalada y mezcla delicadamente.',
      'Refrigera 10 minutos para potenciar sabor.',
      'Prueba sazon y ajusta con sal o vinagre segun gusto.',
      'Sirve fria como plato principal ligero o guarnicion.'
    ],
    tips: [
      'Escurrir bien garbanzos evita ensalada aguada.',
      'El reposo corto en frio mejora mucho el sabor final.'
    ],
    substitutions: [
      'Queso feta por panela en cubos pequenos.',
      'Vinagre tinto por jugo de limon.'
    ]
  },
  {
    id: '22',
    title: 'Tostadas de tinga de pollo',
    category: 'Mex',
    time: '42 min',
    level: 'Intermedio',
    servings: '4 porciones',
    color: ['#fc4a1a', '#f7b733'],
    utensils: ['sarten grande', 'licuadora', 'cuchara', 'cuchillo'],
    ingredients: [
      '3 tazas pollo cocido deshebrado',
      '10 tostadas horneadas',
      '3 jitomates maduros',
      '1/2 cebolla en pluma',
      '1 diente de ajo',
      '1 chile chipotle adobado',
      '1 cda aceite',
      '1/2 taza caldo de pollo',
      'sal al gusto',
      'crema, lechuga y queso para servir'
    ],
    steps: [
      'Licua jitomate, ajo, chipotle y caldo hasta obtener salsa uniforme.',
      'Sofrie cebolla en sarten con aceite hasta que quede transparente.',
      'Agrega salsa licuada y cocina 6 minutos para espesar.',
      'Incorpora pollo deshebrado y mezcla para cubrir por completo.',
      'Cocina a fuego medio 10 minutos, moviendo ocasionalmente.',
      'Ajusta sal y nivel de picante segun preferencia.',
      'Sirve tinga sobre tostadas horneadas.',
      'Termina con lechuga, crema y queso al gusto.'
    ],
    tips: [
      'Si deseas menos picor, usa medio chipotle.',
      'La tinga sabe mejor reposada y recalentada.'
    ],
    substitutions: [
      'Pollo por setas deshebradas salteadas.',
      'Tostada horneada por tortilla caliente si prefieres suave.'
    ]
  }
]

const CATEGORIES = ['Todas', 'Rapidas', 'Fit', 'Mex']
const CONTENT_TOP_PADDING = 10
const MODAL_GESTURE_SAFE_SPACE = 26
const MODAL_BUTTONS_EXTRA_SPACE = 16

const inferAndroidNavigationInset = () => {
  if (Platform.OS !== 'android') {
    return 0
  }

  const windowSize = Dimensions.get('window')
  const screenSize = Dimensions.get('screen')
  const verticalInset = Math.max(0, screenSize.height - windowSize.height)
  const horizontalInset = Math.max(0, screenSize.width - windowSize.width)

  return Math.max(verticalInset, horizontalInset)
}

export default function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [androidBottomInset, setAndroidBottomInset] = useState(() => inferAndroidNavigationInset())
  const androidTopInset = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
  const usesClassicNavButtons = androidBottomInset >= 24
  const modalBottomPadding = Platform.OS === 'android'
    ? usesClassicNavButtons
      ? androidBottomInset + MODAL_BUTTONS_EXTRA_SPACE
      : MODAL_GESTURE_SAFE_SPACE
    : 18

  const fadeAnim = useRef(new Animated.Value(0)).current
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_700Bold
  })

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true
    }).start()
  }, [fadeAnim])

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined
    }

    const subscription = Dimensions.addEventListener('change', () => {
      setAndroidBottomInset(inferAndroidNavigationInset())
    })

    return () => subscription?.remove?.()
  }, [])

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => {
      const categoryOk = activeCategory === 'Todas' || recipe.category === activeCategory
      const textOk = recipe.title.toLowerCase().includes(query.trim().toLowerCase())
      return categoryOk && textOk
    })
  }, [activeCategory, query])

  if (!fontsLoaded) {
    return null
  }

  return (
    <LinearGradient colors={['#fef3c7', '#fde68a', '#fed7aa']} style={styles.screen}>
      <ExpoStatusBar style="dark" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <Animated.View
          style={[
            styles.content,
            {
              paddingTop: CONTENT_TOP_PADDING + androidTopInset,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [22, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.title}>Recetas Flash</Text>
          <Text style={styles.subtitle}>Ideas ricas y muy faciles para hoy</Text>

          <TextInput
            style={styles.search}
            placeholder="Buscar receta..."
            placeholderTextColor="#7c5f3d"
            value={query}
            onChangeText={setQuery}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map((category) => {
              const selected = activeCategory === category
              return (
                <Pressable
                  key={category}
                  onPress={() => setActiveCategory(category)}
                  style={[styles.chip, selected && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{category}</Text>
                </Pressable>
              )
            })}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {filteredRecipes.map((recipe) => (
              <Pressable key={recipe.id} onPress={() => setSelectedRecipe(recipe)} style={styles.cardWrap}>
                {({ pressed }) => (
                  <LinearGradient
                    colors={recipe.color}
                    style={[styles.card, pressed && styles.cardPressed]}
                  >
                    <Text style={styles.cardTitle}>{recipe.title}</Text>
                    <Text style={styles.cardMeta}>{recipe.time} | {recipe.level} | {recipe.servings}</Text>
                    <Text style={styles.cardCategory}>{recipe.category}</Text>
                  </LinearGradient>
                )}
              </Pressable>
            ))}

            {filteredRecipes.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No hay coincidencias</Text>
                <Text style={styles.emptyText}>Prueba otra palabra o categoria.</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        <Modal
          visible={Boolean(selectedRecipe)}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedRecipe(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSafeArea, { paddingBottom: modalBottomPadding }]}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>{selectedRecipe?.title}</Text>
                <Text style={styles.modalMeta}>
                  {selectedRecipe?.time} | {selectedRecipe?.level} | {selectedRecipe?.servings}
                </Text>

                <ScrollView
                  style={styles.modalContentScroll}
                  contentContainerStyle={styles.modalContentScrollBody}
                  showsVerticalScrollIndicator
                >
                  <Text style={styles.modalSection}>Utensilios</Text>
                  {selectedRecipe?.utensils.map((utensil) => (
                    <Text key={utensil} style={styles.modalLine}>- {utensil}</Text>
                  ))}

                  <Text style={styles.modalSection}>Ingredientes</Text>
                  {selectedRecipe?.ingredients.map((ingredient) => (
                    <Text key={ingredient} style={styles.modalLine}>- {ingredient}</Text>
                  ))}

                  <Text style={styles.modalSection}>Pasos</Text>
                  {selectedRecipe?.steps.map((step, index) => (
                    <Text key={step} style={styles.modalLine}>{index + 1}. {step}</Text>
                  ))}

                  <Text style={styles.modalSection}>Tips</Text>
                  {selectedRecipe?.tips.map((tip) => (
                    <Text key={tip} style={styles.modalLine}>- {tip}</Text>
                  ))}

                  <Text style={styles.modalSection}>Sustituciones</Text>
                  {selectedRecipe?.substitutions.map((substitution) => (
                    <Text key={substitution} style={styles.modalLine}>- {substitution}</Text>
                  ))}
                </ScrollView>

                <Pressable style={styles.closeBtn} onPress={() => setSelectedRecipe(null)}>
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  glowOne: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.45)',
    top: -80,
    right: -50
  },
  glowTwo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.28)',
    bottom: 120,
    left: -60
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: CONTENT_TOP_PADDING
  },
  title: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 34,
    color: '#5a2d0c'
  },
  subtitle: {
    fontFamily: 'Quicksand_400Regular',
    fontSize: 15,
    color: '#6b3f16',
    marginTop: 2,
    marginBottom: 14
  },
  search: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Quicksand_400Regular',
    fontSize: 16,
    color: '#4a311b'
  },
  categoryRow: {
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
    alignItems: 'flex-start'
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.65)',
    minHeight: 36,
    justifyContent: 'center',
    alignSelf: 'flex-start'
  },
  chipActive: {
    backgroundColor: '#5a2d0c'
  },
  chipText: {
    fontFamily: 'Quicksand_700Bold',
    color: '#5a2d0c',
    fontSize: 13
  },
  chipTextActive: {
    color: '#fff7ed'
  },
  listContent: {
    paddingTop: 2,
    paddingBottom: 22,
    gap: 10
  },
  cardWrap: {
    marginBottom: 10
  },
  card: {
    borderRadius: 20,
    padding: 18,
    minHeight: 110,
    justifyContent: 'space-between'
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }]
  },
  cardTitle: {
    fontFamily: 'Quicksand_700Bold',
    color: '#fff',
    fontSize: 20
  },
  cardMeta: {
    fontFamily: 'Quicksand_400Regular',
    color: '#fff9ed',
    marginTop: 4,
    fontSize: 13
  },
  cardCategory: {
    fontFamily: 'Quicksand_700Bold',
    color: '#fff',
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  emptyState: {
    marginTop: 10,
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.75)'
  },
  emptyTitle: {
    fontFamily: 'Quicksand_700Bold',
    color: '#5a2d0c',
    fontSize: 16
  },
  emptyText: {
    fontFamily: 'Quicksand_400Regular',
    color: '#6b3f16',
    marginTop: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 11, 3, 0.45)',
    justifyContent: 'flex-end'
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#fff9ed',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 22,
    height: '88%'
  },
  modalContentScroll: {
    flex: 1,
    marginTop: 2
  },
  modalContentScrollBody: {
    paddingBottom: 8
  },
  modalTitle: {
    fontFamily: 'Quicksand_700Bold',
    color: '#5a2d0c',
    fontSize: 24
  },
  modalMeta: {
    fontFamily: 'Quicksand_400Regular',
    color: '#7a4a21',
    marginTop: 3,
    marginBottom: 10
  },
  modalSection: {
    fontFamily: 'Quicksand_700Bold',
    color: '#5a2d0c',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16
  },
  modalLine: {
    fontFamily: 'Quicksand_400Regular',
    color: '#4a311b',
    marginBottom: 4,
    lineHeight: 22
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: '#5a2d0c',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center'
  },
  closeBtnText: {
    fontFamily: 'Quicksand_700Bold',
    color: '#fff8ee',
    fontSize: 15
  }
})
