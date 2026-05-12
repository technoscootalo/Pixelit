const emojiMap = {
    ':grinning:': '😁',
    ':smiley:': '😀',
    ':smile:': '😊',
    ':grin:': '😁',
    ':laughing:': '😆',
    ':sweat_smile:': '😅',
    ':joy:': '😂',
    ':rofl:': '🤣',
    ':relaxed:': '🙂',
    ':blush:': '😊',
    ':innocent:': '😇',
    ':slightly_smiling_face:': '🙂',
    ':upside_down_face:': '🙃',
    ':wink:': '😉',
    ':heart_eyes:': '😍',
    ':kissing_heart:': '😘',
    ':thinking:': '🤔',
    ':neutral_face:': '😐',
    ':expressionless:': '😑',
    ':no_mouth:': '😶',
    ':smirk:': '😏',
    ':unamused:': '😒',
    ':disappointed:': '😞',
    ':pensive:': '😔',
    ':confused:': '😕',
    ':worried:': '😟',
    ':angry:': '😠',
    ':rage:': '😡',
    ':cry:': '😢',
    ':sob:': '😭',
    ':scream:': '😱',
    ':scared:': '😨',
    ':flushed:': '😳',
    ':sleeping:': '😴',
    ':dizzy:': '💫',
    ':astonished:': '😲',
    ':zipper_mouth:': '🤐',
    ':mask:': '😷',
    ':thermometer:': '🤒',
    ':head_bandage:': '🤕',
    ':nauseated:': '🤢',
    ':sick:': '🤮',
    ':smiling_imp:': '😈',
    ':ghost:': '👻',
    ':skull:': '💀',
    ':skull_crossbones:': '☠️',
    ':alien:': '👽',
    ':poop:': '💩',
    ':clown:': '🤡',
    ':cowboy:': '🤠',
    ':see_no_evil:': '🙈',
    ':hear_no_evil:': '🙉',
    ':speak_no_evil:': '🙊',

    // Flowers and Plants
    ':rose:': '🌹',
    ':wilted_rose:': '🥀',
    ':cherry_blossom:': '🌸',
    ':tulip:': '🌷',
    ':sunflower:': '🌻',
    ':blossom:': '🌼',
    ':hibiscus:': '🌺',
    ':cactus:': '🌵',
    ':potted_plant:': '🪴',
    ':shamrock:': '☘️',
    ':herb:': '🌿',

    // Flags
    ':flag_ad:': '🇦🇩',
    ':flag_ae:': '🇦🇪',
    ':flag_af:': '🇦🇫',
    ':flag_ag:': '🇦🇬',
    ':flag_ai:': '🇦🇮',
    ':flag_al:': '🇦🇱',
    ':flag_am:': '🇦🇲',
    ':flag_ao:': '🇦🇴',
    ':flag_ar:': '🇦🇷',
    ':flag_as:': '🇦🇸',
    ':flag_at:': '🇦🇹',
    ':flag_au:': '🇦🇺',
    ':flag_aw:': '🇦🇼',
    ':flag_ax:': '🇦🇽',
    ':flag_az:': '🇦🇿',
    ':flag_ba:': '🇧🇦',
    ':flag_bb:': '🇧🇧',
    ':flag_bd:': '🇧🇩',
    ':flag_be:': '🇧🇪',
    ':flag_bf:': '🇧🇫',
    ':flag_bg:': '🇧🇬',
    ':flag_bh:': '🇧🇭',
    ':flag_bi:': '🇧🇮',
    ':flag_bj:': '🇧🇯',
    ':flag_bl:': '🇧🇱',
    ':flag_bm:': '🇧🇲',
    ':flag_bn:': '🇧🇳',
    ':flag_bo:': '🇧🇴',
    ':flag_bq:': '🇧🇶',
    ':flag_br:': '🇧🇷',
    ':flag_bs:': '🇧🇸',
    ':flag_bt:': '🇧🇹',
    ':flag_bv:': '🇧🇻',
    ':flag_bw:': '🇧🇼',
    ':flag_by:': '🇧🇾',
    ':flag_bz:': '🇧🇿',
    ':flag_ca:': '🇨🇦', // Canada
    ':flag_cc:': '🇨🇨', // Cocos (Keeling) Islands
    ':flag_cd:': '🇨🇩', // Democratic Republic of the Congo
    ':flag_cf:': '🇨🇫', // Central African Republic
    ':flag_cg:': '🇨🇬', // Republic of the Congo
    ':flag_ch:': '🇨🇭', // Switzerland
    ':flag_ci:': '🇨🇮', // Côte d'Ivoire
    ':flag_ck:': '🇨🇰', // Cook Islands
    ':flag_cl:': '🇨🇱', // Chile
    ':flag_cm:': '🇨🇲', // Cameroon
    ':flag_cn:': '🇨🇳', // China
    ':flag_co:': '🇨🇴', // Colombia
    ':flag_cr:': '🇨🇷', // Costa Rica
    ':flag_cu:': '🇨🇺', // Cuba
    ':flag_cv:': '🇨🇻', // Cape Verde
    ':flag_cw:': '🇨🇼', // Curaçao
    ':flag_cx:': '🇰🇭', // Christmas Island
    ':flag_cy:': '🇨🇾', // Cyprus
    ':flag_cz:': '🇨🇿', // Czech Republic
    ':flag_de:': '🇩🇪', // Germany
    ':flag_dj:': '🇩🇯', // Djibouti
    ':flag_dk:': '🇩🇰', // Denmark
    ':flag_dm:': '🇩🇲', // Dominica
    ':flag_do:': '🇩🇴', // Dominican Republic
    ':flag_dz:': '🇩🇿', // Algeria
    ':flag_ec:': '🇪🇨', // Ecuador
    ':flag_ee:': '🇪🇪', // Estonia
    ':flag_eg:': '🇪🇬', // Egypt
    ':flag_eh:': '🇪🇭', // Western Sahara
    ':flag_er:': '🇪🇷', // Eritrea
    ':flag_es:': '🇪🇸', // Spain
    ':flag_et:': '🇪🇹', // Ethiopia
    ':flag_fi:': '🇫🇮', // Finland
    ':flag_fj:': '🇫🇯', // Fiji
    ':flag_fk:': '🇫🇰', // Falkland Islands
    ':flag_fm:': '🇫🇲', // Micronesia
    ':flag_fo:': '🇫🇴', // Faroe Islands
    ':flag_fr:': '🇫🇷', // France
    ':flag_ga:': '🇬🇦', // Gabon
    ':flag_gb:': '🇬🇧', // United Kingdom
    ':flag_gd:': '🇬🇩', // Grenada
    ':flag_ge:': '🇬🇪', // Georgia
    ':flag_gf:': '🇬🇫', // French Guiana
    ':flag_gg:': '🇬🇬', // Guernsey
    ':flag_gh:': '🇬🇭', // Ghana
    ':flag_gi:': '🇬🇮', // Gibraltar
    ':flag_gl:': '🇬🇱', // Greenland
    ':flag_gm:': '🇬🇲', // Gambia
    ':flag_gn:': '🇬🇳', // Guinea
    ':flag_gp:': '🇬🇵', // Guadeloupe
    ':flag_gq:': '🇬🇶', // Equatorial Guinea
    ':flag_gr:': '🇬🇷', // Greece
    ':flag_gt:': '🇬🇹', // Guatemala
    ':flag_gu:': '🇬🇺', // Guam
    ':flag_gw:': '🇬🇼', // Guinea-Bissau
    ':flag_gy:': '🇬🇾', // Guyana

    // Animals
    ':dog:': '🐶',
    ':cat:': '🐱',
    ':mouse:': '🐭',
    ':rabbit:': '🐰',
    ':fox:': '🦊',
    ':hamster:': '🐹',
    ':wolf:': '🐺',
    ':bear:': '🐻',
    ':panda:': '🐼',
    ':crocodile:': '🐊',
    ':whale:': '🐋',
    ':turtle:': '🐢',
    ':fish:': '🐟',
    ':octopus:': '🐙',
    ':shell:': '🐚',

    // Sports and Activities
    ':soccer_ball:': '⚽',
    ':basketball:': '🏀',
    ':football:': '🏈',
    ':baseball:': '⚾',
    ':tennis:': '🎾',
    ':volleyball:': '🏐',
    ':rugby_football:': '🏉',
    ':ping_pong:': '🏓',
    ':badminton:': '🏸',
    ':cricket:': '🏏',
    ':flying_disc:': '🪶',
    ':ice_hockey:': '🏒',
    ':field_hockey:': '🏑',
    ':golf:': '⛳',
    ':kart_racing:': '🏎️',
    ':climbing:': '🧗',
    ':horse_racing:': '🏇',
    ':biking:': '🚴',
    ':mountain_biking:': '🚵',

    // Travel Emojis
    ':airplane:': '✈️',
    ':airplane_departure:': '🛫',
    ':airplane_arriving:': '🛬',
    ':boat:': '🚤',
    ':ferry:': '⛴️',
    ':ship:': '🚢',
    ':railway_car:': '🚃',
    ':train:': '🚆',
    ':train2:': '🚂',
    ':bus:': '🚌',
    ':taxi:': '🚖',
    ':bicycle:': '🚲',
    ':motorcycle:': '🏍️',
    ':walking:': '🚶',
    ':mountain_snow:': '🏔️',
    ':desert:': '🏜️',
    ':palm_tree:': '🌴',
    ':sunny:': '☀️',
    ':city_sunset:': '🌇',
    ':cityscape:': '🏙️',

    // Nature Emojis
    ':tree:': '🌳',
    ':deciduous_tree:': '🌲',
    ':palm_tree:': '🌴',
    ':evergreen_tree:': '🌲',
    ':seedling:': '🌱',
    ':herb:': '🌿',
    ':shamrock:': '☘️',
    ':fallen_leaf:': '🍂',
    ':leaf_fluttering_in_wind:': '🍃',
    ':sun_with_face:': '🌞',
    ':cloud:': '☁️',
    ':rain_cloud:': '🌧️',
    ':snow_cloud:': '🌨️',
    ':thunder_cloud:': '⛈️',
    ':fog:': '🌫️',
    ':mountain:': '⛰️',
    ':mountain_snow:': '🏔️',
    ':volcano:': '🌋',
    ':desert:': '🏜️',
    ':ocean:': '🌊',
    ':waterfall:': '🌊',
    ':rainbow:': '🌈',
    ':star:': '⭐️',
    ':milky_way:': '🌌',

    // Food Emojis
    ':pizza:': '🍕',
    ':hamburger:': '🍔',
    ':fries:': '🍟',
    ':hotdog:': '🌭',
    ':taco:': '🌮',
    ':burrito:': '🌯',
    ':cherries:': '🍒',
    ':grapes:': '🍇',
    ':melon:': '🍈',
    ':watermelon:': '🍉',
    ':apple:': '🍏',
    ':banana:': '🍌',
    ':pear:': '🍐',
    ':peach:': '🍑',
    ':pineapple:': '🍍',
    ':coconut:': '🥥',
    ':kiwifruit:': '🥝',
    ':strawberry:': '🍓',
    ':avocado:': '🥑',
    ':bread:': '🍞',
    ':croissant:': '🥐',
    ':baguette:': '🥖',
    ':cheese:': '🧀',
    ':egg:': '🥚',
    ':meat_on_bone:': '🍖',
    ':poultry_leg:': ' drumstick',
    ':cooked_rice:': '🍚',
    ':rice_ball:': '🍙',
    ':rice:': '🍚',
    ':spaghetti:': '🍝',
    ':fish_cake:': '🍥',
    ':sushi:': '🍣',
    ':curry:': '🍛',
    ':popcorn:': '🍿',
    ':doughnut:': '🍩',
    ':cookie:': '🍪',
    ':birthday:': '🎂',
    ':ice_cream:': '🍦',
    ':shaved_ice:': '🍧',
    ':ice_cream:': '🍨',
    ':trophy:': '🏆',
    ':sparkling_wine:': '🍾',
    ':beer:': '🍺',
    ':beers:': '🍻',
    ':cocktail:': '🍹',
    ':tumbler_glass:': '🥃',
    ':wine_glass:': '🍷',
    ':champagne:': '🍾',

    // Symbol
    ':green_heart:': '💚',
    ':blue_heart:': '💙',
    ':purple_heart:': '💜',
    ':yellow_heart:': '💛',
    ':broken_heart:': '💔',
    ':heartpulse:': '💓',
    ':sparkling_heart:': '💖',
    ':two_hearts:': '💕',
    ':revolving_hearts:': '💞',
    ':heartbeat:': '💓',
    ':fire:': '🔥',
    ':star:': '⭐',
    ':star2:': '🌟',
    ':peace:': '☮️',
    ':cross:': '✝️',
    ':star_of_david:': '✡️',
    ':om:': '🕉️',
    ':crown:': '👑',
    ':crossbones:': '☠️',
    ':clown:': '🤡',
    ':gem:': '💎',
    ':bell:': '🔔',
    ':books:': '📚',

    // Keycaps
    ':keycap_0:': '0️⃣',
    ':keycap_1:': '1️⃣',
    ':keycap_2:': '2️⃣',
    ':keycap_3:': '3️⃣',
    ':keycap_4:': '4️⃣',
    ':keycap_5:': '5️⃣',
    ':keycap_6:': '6️⃣',
    ':keycap_7:': '7️⃣',
    ':keycap_8:': '8️⃣',
    ':keycap_9:': '9️⃣',
    ':keycap_star:': '⭐️',
    ':keycap_hash:': '♯',
};

export default emojiMap;