export interface NepalProvince {
  id: string;
  nameEn: string;
  nameNp: string;
  districts: NepalDistrict[];
}

export interface NepalDistrict {
  id: string;
  nameEn: string;
  nameNp: string;
  maxWards?: number;
  municipalities: string[];
}

export const NEPAL_PROVINCES: NepalProvince[] = [
  {
    id: 'bagmati',
    nameEn: 'Bagmati Province',
    nameNp: 'बागमती प्रदेश',
    districts: [
      {
        id: 'kathmandu',
        nameEn: 'Kathmandu',
        nameNp: 'काठमाडौँ',
        municipalities: [
          'Kathmandu Metropolitan City (काठमाडौँ महानगरपालिका)',
          'Tarakeshwor Municipality (तारकेश्वर नगरपालिका)',
          'Tokha Municipality (टोखा नगरपालिका)',
          'Budhanilkantha Municipality (बुढानीलकण्ठ नगरपालिका)',
          'Nagarjun Municipality (नागार्जुन नगरपालिका)',
          'Chandragiri Municipality (चन्द्रागिरि नगरपालिका)',
          'Kirtipur Municipality (कीर्तिपुर नगरपालिका)',
          'Gokarneshwor Municipality (गोकर्णेश्वर नगरपालिका)',
          'Kageshwori Manohara (कागेश्वरी मनोहरा)',
          'Shankharapur Municipality (शङ्खरापुर नगरपालिका)',
          'Dakshinkali Municipality (दक्षिणकाली नगरपालिका)',
        ],
      },
      {
        id: 'lalitpur',
        nameEn: 'Lalitpur',
        nameNp: 'ललितपुर',
        municipalities: [
          'Lalitpur Metropolitan City (ललितपुर महानगरपालिका)',
          'Mahalaxmi Municipality (महालक्ष्मी नगरपालिका)',
          'Godawari Municipality (गोदावरी नगरपालिका)',
          'Konjyosom Rural Municipality (कोन्ज्योसोम गाउँपालिका)',
          'Bagmati Rural Municipality (बागमती गाउँपालिका)',
          'Mahankal Rural Municipality (महाङ्काल गाउँपालिका)',
        ],
      },
      {
        id: 'bhaktapur',
        nameEn: 'Bhaktapur',
        nameNp: 'भक्तपुर',
        municipalities: [
          'Bhaktapur Municipality (भक्तपुर नगरपालिका)',
          'Madhyapur Thimi Municipality (मध्यपुर थिमी नगरपालिका)',
          'Suryabinayak Municipality (सूर्यविनायक नगरपालिका)',
          'Changunarayan Municipality (चाँगुनारायण नगरपालिका)',
        ],
      },
      {
        id: 'chitwan',
        nameEn: 'Chitwan',
        nameNp: 'चितवन',
        municipalities: [
          'Bharatpur Metropolitan City (भरतपुर महानगरपालिका)',
          'Ratnanagar Municipality (रत्ननगर नगरपालिका)',
          'Khairahani Municipality (खैरहनी नगरपालिका)',
          'Rapti Municipality (राप्ती नगरपालिका)',
          'Kalika Municipality (कालिका नगरपालिका)',
          'Madi Municipality (माडी नगरपालिका)',
          'Ichhyakamana Rural Municipality (इच्छाकामना गाउँपालिका)',
        ],
      },
      {
        id: 'makwanpur',
        nameEn: 'Makwanpur',
        nameNp: 'मकवानपुर',
        municipalities: [
          'Hetauda Sub-Metropolitan City (हेटौंडा उपमहानगरपालिका)',
          'Thaha Municipality (थाहा नगरपालिका)',
          'Bhimfedi Rural Municipality (भीमफेदी)',
          'Bakaiya Rural Municipality (बकैया)',
          'Manahari Rural Municipality (मनहरी)',
        ],
      },
      {
        id: 'kavre',
        nameEn: 'Kavrepalanchok',
        nameNp: 'काभ्रेपलाञ्चोक',
        municipalities: [
          'Dhulikhel Municipality (धुलिखेल नगरपालिका)',
          'Banepa Municipality (बनेपा नगरपालिका)',
          'Panauti Municipality (पनौती नगरपालिका)',
          'Panchkhal Municipality (पाँचखाल नगरपालिका)',
          'Namobuddha Municipality (नमोबुद्ध नगरपालिका)',
          'Mandandeupur Municipality (मण्डनदेउपुर नगरपालिका)',
        ],
      },
      {
        id: 'dhading',
        nameEn: 'Dhading',
        nameNp: 'धादिङ',
        municipalities: [
          'Nilkantha Municipality (नीलकण्ठ नगरपालिका)',
          'Dhunibeshi Municipality (धुनीबेंशी नगरपालिका)',
          'Galchhi Rural Municipality (गल्छी)',
          'Gajuri Rural Municipality (गजुरी)',
          'Benighat Rorang (बेनीघाट रोराङ)',
        ],
      },
      {
        id: 'nuwakot',
        nameEn: 'Nuwakot',
        nameNp: 'नुवाकोट',
        municipalities: [
          'Bidur Municipality (विदुर नगरपालिका)',
          'Belkotgadhi Municipality (बेलकोटगढी नगरपालिका)',
          'Kakani Rural Municipality (ककनी)',
          'Suryagadhi Rural Municipality (सूर्यगढी)',
          'Likhu Rural Municipality (लिखु)',
        ],
      },
      {
        id: 'sindhupalchok',
        nameEn: 'Sindhupalchok',
        nameNp: 'सिन्धुपाल्चोक',
        municipalities: [
          'Chautara Sangachokgadhi (चौतारा साँगाचोकगढी)',
          'Melamchi Municipality (मेलम्ची नगरपालिका)',
          'Barhabise Municipality (बाह्रविसे नगरपालिका)',
        ],
      },
      {
        id: 'sindhuli',
        nameEn: 'Sindhuli',
        nameNp: 'सिन्धुली',
        municipalities: ['Kamalamai Municipality (कमलामाई नगरपालिका)', 'Dudhaili Municipality (दुधौली नगरपालिका)'],
      },
      {
        id: 'ramechhap',
        nameEn: 'Ramechhap',
        nameNp: 'रामेछाप',
        municipalities: ['Manthali Municipality (मन्थली नगरपालिका)', 'Ramechhap Municipality (रामेछाप नगरपालिका)'],
      },
      {
        id: 'dolakha',
        nameEn: 'Dolakha',
        nameNp: 'दोलखा',
        municipalities: ['Bhimeshwor Municipality (भीमेश्वर नगरपालिका)', 'Jiri Municipality (जिरी नगरपालिका)'],
      },
      {
        id: 'rasuwa',
        nameEn: 'Rasuwa',
        nameNp: 'रसुवा',
        municipalities: ['Gosaikunda Rural Municipality (गोसाइँकुण्ड)', 'Uttargaya (उत्तरगया)', 'Kalika (कालिका)'],
      },
    ],
  },
  {
    id: 'koshi',
    nameEn: 'Koshi Province',
    nameNp: 'कोशी प्रदेश',
    districts: [
      {
        id: 'morang',
        nameEn: 'Morang',
        nameNp: 'मोरङ',
        municipalities: [
          'Biratnagar Metropolitan City (विराटनगर महानगरपालिका)',
          'Sundarharaicha Municipality (सुन्दरहरैंचा नगरपालिका)',
          'Belbari Municipality (बेलबारी नगरपालिका)',
          'Pathari Sanischare (पथरी शनिश्चरे)',
          'Urlabari Municipality (उर्लाबारी नगरपालिका)',
          'Rangeli Municipality (रङ्गेली नगरपालिका)',
        ],
      },
      {
        id: 'sunsari',
        nameEn: 'Sunsari',
        nameNp: 'सुनसरी',
        municipalities: [
          'Dharan Sub-Metropolitan City (धरान उपमहानगरपालिका)',
          'Itahari Sub-Metropolitan City (इटहरी उपमहानगरपालिका)',
          'Inaruwa Municipality (इनरुवा नगरपालिका)',
          'Duhabi Municipality (दुहबी नगरपालिका)',
          'Ramdhuni Municipality (रामधुनी नगरपालिका)',
          'Barahachhetra Municipality (वराहक्षेत्र नगरपालिका)',
        ],
      },
      {
        id: 'jhapa',
        nameEn: 'Jhapa',
        nameNp: 'झापा',
        municipalities: [
          'Birtamod Municipality (बिर्तामोड नगरपालिका)',
          'Damak Municipality (दमक नगरपालिका)',
          'Mechinagar Municipality (मेचीनगर नगरपालिका)',
          'Bhadrapur Municipality (भद्रपुर नगरपालिका)',
          'Kankai Municipality (कन्काई नगरपालिका)',
          'Shivasatakshi Municipality (शिवसताक्षी नगरपालिका)',
        ],
      },
      {
        id: 'ilam',
        nameEn: 'Ilam',
        nameNp: 'इलाम',
        municipalities: ['Ilam Municipality (इलाम नगरपालिका)', 'Suryodaya Municipality (सूर्योदय नगरपालिका)', 'Deumai (देउमाई)'],
      },
      {
        id: 'dhankuta',
        nameEn: 'Dhankuta',
        nameNp: 'धनकुटा',
        municipalities: ['Dhankuta Municipality (धनकुटा नगरपालिका)', 'Pakhribas Municipality (पाख्रीबास)'],
      },
      {
        id: 'udayapur',
        nameEn: 'Udayapur',
        nameNp: 'उदयपुर',
        municipalities: ['Triyuga Municipality (त्रियुगा नगरपालिका)', 'Katari Municipality (कटारी नगरपालिका)', 'Chaudandigadhi (चौदण्डीगढी)'],
      },
      {
        id: 'bhojpur',
        nameEn: 'Bhojpur',
        nameNp: 'भोजपुर',
        municipalities: ['Bhojpur Municipality (भोजपुर नगरपालिका)', 'Shadananda Municipality (षडानन्द)'],
      },
      {
        id: 'sankhuwasabha',
        nameEn: 'Sankhuwasabha',
        nameNp: 'सङ्खुवासभा',
        municipalities: ['Khandbari Municipality (खाँदबारी नगरपालिका)', 'Chainpur Municipality (चैनपुर)'],
      },
      {
        id: 'solukhumbu',
        nameEn: 'Solukhumbu',
        nameNp: 'सोलुखुम्बु',
        municipalities: ['Solududhkunda Municipality (सोलुदुधकुण्ड नगरपालिका)'],
      },
      {
        id: 'okhaldhunga',
        nameEn: 'Okhaldhunga',
        nameNp: 'ओखलढुङ्गा',
        municipalities: ['Siddhicharan Municipality (सिद्धिचरण नगरपालिका)'],
      },
      {
        id: 'khotang',
        nameEn: 'Khotang',
        nameNp: 'खोटाङ',
        municipalities: ['Diktel Rupakot Majhuwagadhi (दिक्तेल रुपाकोट मझुवागढी)', 'Halesi Tuwachung (हलेसी तुवाचुङ)'],
      },
      {
        id: 'panchthar',
        nameEn: 'Panchthar',
        nameNp: 'पाँचथर',
        municipalities: ['Phidim Municipality (फिदिम नगरपालिका)'],
      },
      {
        id: 'taplejung',
        nameEn: 'Taplejung',
        nameNp: 'ताप्लेजुङ',
        municipalities: ['Phungling Municipality (फुङलिङ नगरपालिका)'],
      },
      {
        id: 'terhathum',
        nameEn: 'Terhathum',
        nameNp: 'तेह्रथुम',
        municipalities: ['Myanglung Municipality (म्याङलुङ नगरपालिका)', 'Laligurans Municipality (लालीगुराँस)'],
      },
    ],
  },
  {
    id: 'madhesh',
    nameEn: 'Madhesh Province',
    nameNp: 'मधेश प्रदेश',
    districts: [
      {
        id: 'parsa',
        nameEn: 'Parsa',
        nameNp: 'पर्सा',
        municipalities: ['Birgunj Metropolitan City (वीरगञ्ज महानगरपालिका)', 'Pokhariya Municipality (पोखरिया नगरपालिका)'],
      },
      {
        id: 'dhanusha',
        nameEn: 'Dhanusha',
        nameNp: 'धनुषा',
        municipalities: ['Janakpurdham Sub-Metropolitan (जनकपुरधाम उपमहानगरपालिका)', 'Mithila Municipality (मिथिला)', 'Sabaila (सबैला)'],
      },
      {
        id: 'bara',
        nameEn: 'Bara',
        nameNp: 'बारा',
        municipalities: ['Kalaiya Sub-Metropolitan City (कलैया उपमहानगरपालिका)', 'Jeetpur Simara Sub-Metro (जितपुर सिमरा)', 'Kolhabi (कोल्हवी)'],
      },
      {
        id: 'sarlahi',
        nameEn: 'Sarlahi',
        nameNp: 'सर्लाही',
        municipalities: ['Malangwa Municipality (मलङ्गवा नगरपालिका)', 'Hariwan Municipality (हरिवन)', 'Lalbandi Municipality (लालबन्दी)'],
      },
      {
        id: 'rautahat',
        nameEn: 'Rautahat',
        nameNp: 'रौतहट',
        municipalities: ['Gaur Municipality (गौर नगरपालिका)', 'Chandrapur Municipality (चन्द्रपुर)', 'Garuda Municipality (गरुडा)'],
      },
      {
        id: 'mahottari',
        nameEn: 'Mahottari',
        nameNp: 'महोत्तरी',
        municipalities: ['Jaleshwor Municipality (जलेश्वर नगरपालिका)', 'Bardibas Municipality (बर्दिबास)', 'Gaushala Municipality (गौशाला)'],
      },
      {
        id: 'siraha',
        nameEn: 'Siraha',
        nameNp: 'सिराहा',
        municipalities: ['Lahan Municipality (लहान नगरपालिका)', 'Siraha Municipality (सिराहा)', 'Golbazar Municipality (गोलबजार)'],
      },
      {
        id: 'saptari',
        nameEn: 'Saptari',
        nameNp: 'सप्तरी',
        municipalities: ['Rajbiraj Municipality (राजविराज नगरपालिका)', 'Kanchanrup Municipality (कञ्चनरुप)', 'Dakneshwori (डाक्नेश्वरी)'],
      },
    ],
  },
  {
    id: 'gandaki',
    nameEn: 'Gandaki Province',
    nameNp: 'गण्डकी प्रदेश',
    districts: [
      {
        id: 'kaski',
        nameEn: 'Kaski',
        nameNp: 'कास्की',
        municipalities: ['Pokhara Metropolitan City (पोखरा महानगरपालिका)', 'Annapurna Rural Municipality (अन्नपूर्ण)', 'Rupa (रूपा)'],
      },
      {
        id: 'tanahun',
        nameEn: 'Tanahun',
        nameNp: 'तनहुँ',
        municipalities: ['Byas Municipality (व्यास नगरपालिका)', 'Shuklagandaki Municipality (शुक्लागण्डकी)', 'Bhanu Municipality (भानु)'],
      },
      {
        id: 'nawalpur',
        nameEn: 'Nawalpur (Nawalparasi East)',
        nameNp: 'नवलपुर (नवलपरासी पूर्व)',
        municipalities: ['Kawasoti Municipality (कावासोती नगरपालिका)', 'Gaindakot Municipality (गैँडाकोट)', 'Devchuli Municipality (देवचुली)', 'Madhyabindu (मध्यविन्दु)'],
      },
      {
        id: 'syangja',
        nameEn: 'Syangja',
        nameNp: 'स्याङ्जा',
        municipalities: ['Putalibazar Municipality (पुतलीबजार नगरपालिका)', 'Waling Municipality (वालिङ नगरपालिका)', 'Galyang (गल्याङ)'],
      },
      {
        id: 'gorkha',
        nameEn: 'Gorkha',
        nameNp: 'गोरखा',
        municipalities: ['Gorkha Municipality (गोरखा नगरपालिका)', 'Palungtar Municipality (पालुङटार)'],
      },
      {
        id: 'lamjung',
        nameEn: 'Lamjung',
        nameNp: 'लमजुङ',
        municipalities: ['Besisahar Municipality (बेसीशहर नगरपालिका)', 'Sundarbazar Municipality (सुन्दरबजार)'],
      },
      {
        id: 'baglung',
        nameEn: 'Baglung',
        nameNp: 'बागलुङ',
        municipalities: ['Baglung Municipality (बागलुङ नगरपालिका)', 'Galkot Municipality (गलकोट)', 'Jaimini (जैमिनी)'],
      },
      {
        id: 'parbat',
        nameEn: 'Parbat',
        nameNp: 'पर्वत',
        municipalities: ['Kushma Municipality (कुश्मा नगरपालिका)', 'Phalebas Municipality (फलेवास)'],
      },
      {
        id: 'myagdi',
        nameEn: 'Myagdi',
        nameNp: 'म्याग्दी',
        municipalities: ['Beni Municipality (बेनी नगरपालिका)'],
      },
      {
        id: 'mustang',
        nameEn: 'Mustang',
        nameNp: 'मुस्ताङ',
        municipalities: ['Gharapjhong Rural Municipality (घरपझोङ)', 'Baragung Muktichhetra (बारागुङ मुक्ति क्षेत्र)'],
      },
      {
        id: 'manang',
        nameEn: 'Manang',
        nameNp: 'मनाङ',
        municipalities: ['Chame Rural Municipality (चामे)', 'Nason (नासोन)'],
      },
    ],
  },
  {
    id: 'lumbini',
    nameEn: 'Lumbini Province',
    nameNp: 'लुम्बिनी प्रदेश',
    districts: [
      {
        id: 'rupandehi',
        nameEn: 'Rupandehi',
        nameNp: 'रुपन्देही',
        municipalities: [
          'Butwal Sub-Metropolitan City (बुटवल उपमहानगरपालिका)',
          'Siddharthanagar Municipality (सिद्धार्थनगर / भैरहवा)',
          'Tilottama Municipality (तिलोत्तमा नगरपालिका)',
          'Sainamaina Municipality (सैनामैना नगरपालिका)',
          'Devdaha Municipality (देवदह नगरपालिका)',
          'Lumbini Sanskritik Municipality (लुम्बिनी सांस्कृतिक)',
        ],
      },
      {
        id: 'dang',
        nameEn: 'Dang',
        nameNp: 'दाङ',
        municipalities: [
          'Ghorahi Sub-Metropolitan City (घोराही उपमहानगरपालिका)',
          'Tulsipur Sub-Metropolitan City (तुलसीपुर उपमहानगरपालिका)',
          'Lamahi Municipality (लमही नगरपालिका)',
        ],
      },
      {
        id: 'banke',
        nameEn: 'Banke',
        nameNp: 'बाँके',
        municipalities: ['Nepalgunj Sub-Metropolitan City (नेपालगञ्ज उपमहानगरपालिका)', 'Kohalpur Municipality (कोहलपुर नगरपालिका)'],
      },
      {
        id: 'bardiya',
        nameEn: 'Bardiya',
        nameNp: 'बर्दिया',
        municipalities: ['Gulariya Municipality (गुलरिया नगरपालिका)', 'Bansgadhi Municipality (बाँसगढी)', 'Barbardiya (बारबर्दिया)', 'Rajapur (राजापुर)'],
      },
      {
        id: 'kapilvastu',
        nameEn: 'Kapilvastu',
        nameNp: 'कपिलवस्तु',
        municipalities: ['Kapilvastu Municipality (तौलिहवा / कपिलवस्तु)', 'Banganga Municipality (बाणगङ्गा)', 'Buddhabhumi (बुद्धभूमि)', 'Shivaraj (शिवराज)'],
      },
      {
        id: 'palpa',
        nameEn: 'Palpa',
        nameNp: 'पाल्पा',
        municipalities: ['Tansen Municipality (तानसेन नगरपालिका)', 'Rampur Municipality (रामपुर नगरपालिका)'],
      },
      {
        id: 'nawalparasi_west',
        nameEn: 'Parasi (Nawalparasi West)',
        nameNp: 'परासी (नवलपरासी पश्चिम)',
        municipalities: ['Ramgram Municipality (रामग्राम नगरपालिका)', 'Sunwal Municipality (सुनवल नगरपालिका)', 'Bardghat (बर्दघाट)'],
      },
      {
        id: 'gulmi',
        nameEn: 'Gulmi',
        nameNp: 'गुल्मी',
        municipalities: ['Resunga Municipality (रेसुङ्गा नगरपालिका)', 'Musikot Municipality (मुसिकोट)'],
      },
      {
        id: 'arghakhanchi',
        nameEn: 'Arghakhanchi',
        nameNp: 'अर्घाखाँची',
        municipalities: ['Sandhikharka Municipality (सन्धिखर्क नगरपालिका)', 'Sitganga Municipality (सीतागङ्गा)', 'Bhumikasthan (भूमिकास्थान)'],
      },
      {
        id: 'pyuthan',
        nameEn: 'Pyuthan',
        nameNp: 'प्युठान',
        municipalities: ['Pyuthan Municipality (प्युठान नगरपालिका)', 'Swargadwari Municipality (स्वर्गद्वारी)'],
      },
      {
        id: 'rolpa',
        nameEn: 'Rolpa',
        nameNp: 'रोल्पा',
        municipalities: ['Rolpa Municipality (रोल्पा नगरपालिका / लिवाङ)'],
      },
      {
        id: 'rukum_east',
        nameEn: 'Rukum East',
        nameNp: 'रुकुम पूर्व',
        municipalities: ['Rukumkot / Sisne (सिस्ने गाउँपालिका)', 'Bhume (भूमे)', 'Putha Uttarganga (पुथा उत्तरगङ्गा)'],
      },
    ],
  },
  {
    id: 'karnali',
    nameEn: 'Karnali Province',
    nameNp: 'कर्णाली प्रदेश',
    districts: [
      {
        id: 'surkhet',
        nameEn: 'Surkhet',
        nameNp: 'सुर्खेत',
        municipalities: ['Birendranagar Municipality (वीरेन्द्रनगर नगरपालिका)', 'Gurbhakot Municipality (गुर्भाकोट)', 'Bheriganga (भेरीगङ्गा)'],
      },
      {
        id: 'dailekh',
        nameEn: 'Dailekh',
        nameNp: 'दैलेख',
        municipalities: ['Narayan Municipality (नारायण नगरपालिका)', 'Dullu Municipality (दुल्लु नगरपालिका)', 'Chamunda Bindrasaini (चामुण्डा विन्द्रासैनी)'],
      },
      {
        id: 'salyan',
        nameEn: 'Salyan',
        nameNp: 'सल्यान',
        municipalities: ['Sharada Municipality (शारदा नगरपालिका)', 'Bagchaur Municipality (बागचौर)', 'Bangad Kupinde (बनगाड कुपिण्डे)'],
      },
      {
        id: 'jumla',
        nameEn: 'Jumla',
        nameNp: 'जुम्ला',
        municipalities: ['Chandannath Municipality (चन्दननाथ नगरपालिका)'],
      },
      {
        id: 'jajarkot',
        nameEn: 'Jajarkot',
        nameNp: 'जाजरकोट',
        municipalities: ['Bheri Municipality (भेरी नगरपालिका)', 'Chhedagad Municipality (छेडागाड)', 'Nalgad (नलगाड)'],
      },
      {
        id: 'kalikot',
        nameEn: 'Kalikot',
        nameNp: 'कालिकोट',
        municipalities: ['Khandachakra Municipality (खाँडाचक्र नगरपालिका)', 'Raskot Municipality (रास्कोट)', 'Tilagufa (तिलागुफा)'],
      },
      {
        id: 'rukum_west',
        nameEn: 'Rukum West',
        nameNp: 'रुकुम पश्चिम',
        municipalities: ['Musikot Municipality (मुसिकोट नगरपालिका)', 'Chaurjahari Municipality (चौरजहारी)', 'Aathbiskot (आठबिसकोट)'],
      },
      {
        id: 'mugu',
        nameEn: 'Mugu',
        nameNp: 'मुगु',
        municipalities: ['Chhayanath Rara Municipality (छायाँनाथ रारा नगरपालिका)'],
      },
      {
        id: 'humla',
        nameEn: 'Humla',
        nameNp: 'हुम्ला',
        municipalities: ['Simkot Rural Municipality (सिमकोट)'],
      },
      {
        id: 'dolpa',
        nameEn: 'Dolpa',
        nameNp: 'डोल्पा',
        municipalities: ['Thuli Bheri Municipality (ठूली भेरी नगरपालिका)', 'Tripurasundari Municipality (त्रिपुरासुन्दरी)'],
      },
    ],
  },
  {
    id: 'sudurpashchim',
    nameEn: 'Sudurpashchim Province',
    nameNp: 'सुदूरपश्चिम प्रदेश',
    districts: [
      {
        id: 'kailali',
        nameEn: 'Kailali',
        nameNp: 'कैलाली',
        municipalities: [
          'Dhangadhi Sub-Metropolitan City (धनगढी उपमहानगरपालिका)',
          'Tikapur Municipality (टीकापुर नगरपालिका)',
          'Godawari Municipality (गोदावरी / अत्तरिया)',
          'Lamkichuha Municipality (लम्कीचुहा नगरपालिका)',
          'Ghodaghodi Municipality (घोडाघोडी नगरपालिका)',
          'Bhajani Municipality (भजनी नगरपालिका)',
        ],
      },
      {
        id: 'kanchanpur',
        nameEn: 'Kanchanpur',
        nameNp: 'कञ्चनपुर',
        municipalities: [
          'Bhimdatta Municipality (भीमदत्त / महेन्द्रनगर)',
          'Bedkot Municipality (वेदकोट नगरपालिका)',
          'Shuklaphanta Municipality (शुक्लाफाँटा नगरपालिका)',
          'Krishnapur Municipality (कृष्णपुर नगरपालिका)',
          'Punarbas Municipality (पुनर्वास नगरपालिका)',
        ],
      },
      {
        id: 'dadeldhura',
        nameEn: 'Dadeldhura',
        nameNp: 'डडेल्धुरा',
        municipalities: ['Amargadhi Municipality (अमरगढी नगरपालिका)', 'Parshuram Municipality (परशुराम नगरपालिका)'],
      },
      {
        id: 'doti',
        nameEn: 'Doti',
        nameNp: 'डोटी',
        municipalities: ['Dipayal Silgadhi Municipality (दिपायल सिलगढी नगरपालिका)', 'Shikhar Municipality (शिखर नगरपालिका)'],
      },
      {
        id: 'achham',
        nameEn: 'Achham',
        nameNp: 'अछाम',
        municipalities: ['Mangalsen Municipality (मङ्गलसेन नगरपालिका)', 'Sanfebagar Municipality (साँफेबगर नगरपालिका)', 'Kamalbazar (कमलबजार)'],
      },
      {
        id: 'baitadi',
        nameEn: 'Baitadi',
        nameNp: 'बैतडी',
        municipalities: ['Dasharathchand Municipality (दशरथचन्द नगरपालिका)', 'Patan Municipality (पाटन नगरपालिका)', 'Melauli (मेलौली)'],
      },
      {
        id: 'darchula',
        nameEn: 'Darchula',
        nameNp: 'दार्चुला',
        municipalities: ['Mahakali Municipality (महाकाली नगरपालिका)', 'Shailyashikhar Municipality (शैल्यशिखर)'],
      },
      {
        id: 'bajhang',
        nameEn: 'Bajhang',
        nameNp: 'बझाङ',
        municipalities: ['Jayaprithvi Municipality (जयपृथ्वी नगरपालिका)', 'Bungal Municipality (बुङ्गल नगरपालिका)'],
      },
      {
        id: 'bajura',
        nameEn: 'Bajura',
        nameNp: 'बाजुरा',
        municipalities: ['Badimalika Municipality (बडीमालिका नगरपालिका)', 'Tribeni Municipality (त्रिवेणी)', 'Budhiganga (बुढीगङ्गा)'],
      },
    ],
  },
];

// District-level maximum number of wards based on the local government restructuring of Nepal
export const DISTRICT_MAX_WARDS: Record<string, number> = {
  // Bagmati Province
  kathmandu: 32, // Kathmandu Metro has 32 wards
  lalitpur: 29,   // Lalitpur Metro has 29 wards
  bhaktapur: 10,  // Bhaktapur has max 10 wards (Bhaktapur: 10, Madhyapur: 9, Suryabinayak: 10, Changunarayan: 9)
  chitwan: 29,    // Bharatpur Metro has 29 wards
  makwanpur: 19,  // Hetauda Sub-metro has 19 wards
  kavre: 14,      // Banepa has 14 wards
  dhading: 14,    // Nilkantha has 14 wards
  nuwakot: 13,    // Bidur has 13 wards
  sindhupalchok: 14,
  sindhuli: 14,
  ramechhap: 14,
  dolakha: 9,
  rasuwa: 6,

  // Koshi Province
  morang: 19,     // Biratnagar Metro has 19 wards
  sunsari: 20,    // Dharan & Itahari Sub-metros have 20 wards
  jhapa: 15,      // Mechinagar has 15 wards
  ilam: 14,
  dhankuta: 10,
  udayapur: 16,
  bhojpur: 14,
  sankhuwasabha: 11,
  solukhumbu: 11,
  okhaldhunga: 12,
  khotang: 15,
  panchthar: 14,
  taplejung: 11,
  terhathum: 10,

  // Madhesh Province
  parsa: 32,      // Birgunj Metro has 32 wards
  dhanusha: 25,   // Janakpur Sub-metro has 25 wards
  bara: 27,       // Kalaiya Sub-metro has 27 wards, Jitpur Simara: 24 wards
  sarlahi: 18,
  rautahat: 16,
  mahottari: 16,
  siraha: 24,     // Lahan: 24 wards, Siraha: 22 wards
  saptari: 18,

  // Gandaki Province
  kaski: 33,      // Pokhara Metro has 33 wards (highest in Nepal)
  tanahun: 14,    // Vyas has 14 wards
  nawalpur: 18,   // Gaindakot has 18 wards, Kawasoti: 17 wards
  syangja: 14,
  gorkha: 14,
  lamjung: 11,
  baglung: 14,
  parbat: 14,
  myagdi: 10,
  mustang: 5,     // All Mustang rural municipalities have 5 wards
  manang: 9,

  // Lumbini Province
  rupandehi: 19,  // Butwal Sub-metro has 19 wards, Tilottama: 17 wards
  dang: 19,       // Ghorahi & Tulsipur Sub-metros have 19 wards
  banke: 23,      // Nepalgunj Sub-metro has 23 wards
  bardiya: 12,
  kapilvastu: 12,
  palpa: 14,
  parasi: 18,     // Ramgram has 18 wards
  gulmi: 14,
  arghakhanchi: 14,
  pyuthan: 10,
  rolpa: 10,
  rukum_east: 14,

  // Karnali Province
  surkhet: 16,    // Birendranagar has 16 wards
  dailekh: 13,
  salyan: 15,
  jumla: 10,
  jajarkot: 13,
  kalikot: 11,
  rukum_west: 14,
  mugu: 14,
  humla: 8,
  dolpa: 11,

  // Sudurpashchim Province
  kailali: 19,    // Dhangadhi Sub-metro has 19 wards
  kanchanpur: 19, // Bhimdatta has 19 wards
  dadeldhura: 12,
  doti: 11,
  achham: 14,
  baitadi: 11,
  darchula: 9,
  bajhang: 11,
  bajura: 10,
};

// Specific municipality ward counts across Nepal
export const MUNICIPALITY_WARD_COUNTS: Record<string, number> = {
  // Kathmandu District
  'kathmandu metropolitan city': 32,
  'काठमाडौँ महानगरपालिका': 32,
  'tarakeshwor municipality': 11,
  'तारकेश्वर नगरपालिका': 11,
  'tokha municipality': 11,
  'टोखा नगरपालिका': 11,
  'budhanilkantha municipality': 13,
  'बुढानीलकण्ठ नगरपालिका': 13,
  'nagarjun municipality': 10,
  'नागार्जुन नगरपालिका': 10,
  'chandragiri municipality': 15,
  'चन्द्रागिरि नगरपालिका': 15,
  'kirtipur municipality': 10,
  'कीर्तिपुर नगरपालिका': 10,
  'gokarneshwor municipality': 9,
  'गोकर्णेश्वर नगरपालिका': 9,
  'kageshwori manohara': 9,
  'कागेश्वरी मनोहरा': 9,
  'shankharapur municipality': 9,
  'शङ्खरापुर नगरपालिका': 9,
  'dakshinkali municipality': 9,
  'दक्षिणकाली नगरपालिका': 9,

  // Lalitpur District
  'lalitpur metropolitan city': 29,
  'ललितपुर महानगरपालिका': 29,
  'mahalaxmi municipality': 10,
  'महालक्ष्मी नगरपालिका': 10,
  'godawari municipality': 14,
  'गोदावरी नगरपालिका': 14,
  'konjyosom rural municipality': 5,
  'कोन्ज्योसोम गाउँपालिका': 5,
  'bagmati rural municipality': 7,
  'बागमती गाउँपालिका': 7,
  'mahankal rural municipality': 6,
  'महाङ्काल गाउँपालिका': 6,

  // Bhaktapur District (Max 10 wards anywhere in Bhaktapur)
  'bhaktapur municipality': 10,
  'भक्तपुर नगरपालिका': 10,
  'madhyapur thimi municipality': 9,
  'मध्यपुर थिमी नगरपालिका': 9,
  'suryabinayak municipality': 10,
  'सूर्यविनायक नगरपालिका': 10,
  'changunarayan municipality': 9,
  'चाँगुनारायण नगरपालिका': 9,

  // Chitwan District
  'bharatpur metropolitan city': 29,
  'भरतपुर महानगरपालिका': 29,
  'ratnanagar municipality': 16,
  'रत्ननगर नगरपालिका': 16,
  'khairahani municipality': 13,
  'खैरहनी नगरपालिका': 13,
  'rapti municipality': 13,
  'राप्ती नगरपालिका': 13,
  'kalika municipality': 11,
  'कालिका नगरपालिका': 11,
  'madi municipality': 9,
  'माडी नगरपालिका': 9,
  'ichhyakamana rural municipality': 7,
  'इच्छाकामना गाउँपालिका': 7,

  // Makwanpur District
  'hetauda sub-metropolitan city': 19,
  'हेटौंडा उपमहानगरपालिका': 19,
  'thaha municipality': 12,
  'थाहा नगरपालिका': 12,
  'bhimfedi rural municipality': 9,
  'भीमफेदी': 9,
  'bakaiya rural municipality': 12,
  'बकैया': 12,
  'manahari rural municipality': 9,
  'मनहरी': 9,

  // Kaski District
  'pokhara metropolitan city': 33,
  'पोखरा महानगरपालिका': 33,
  'annapurna rural municipality': 11,
  'machhapuchhre': 9,
  'rupa': 7,

  // Morang District
  'biratnagar metropolitan city': 19,
  'विराटनगर महानगरपालिका': 19,
  'sundarharaicha municipality': 12,
  'बेलबारी नगरपालिका': 11,
  'belbari municipality': 11,
  'pathari sanischare': 10,
  'urlabari municipality': 9,
  'rangeli municipality': 9,

  // Sunsari District
  'dharan sub-metropolitan city': 20,
  'धरान उपमहानगरपालिका': 20,
  'itahari sub-metropolitan city': 20,
  'इटहरी उपमहानगरपालिका': 20,
  'inaruwa municipality': 10,
  'duhabi municipality': 12,
  'ramdhuni municipality': 9,
  'barahachhetra municipality': 11,

  // Jhapa District
  'birtamod municipality': 10,
  'damak municipality': 10,
  'mechinagar municipality': 15,
  'bhadrapur municipality': 10,
  'kankai municipality': 9,
  'shivasatakshi municipality': 11,

  // Parsa District
  'birgunj metropolitan city': 32,
  'वीरगञ्ज महानगरपालिका': 32,

  // Dhanusha District
  'janakpur sub-metropolitan city': 25,
  'जनकपुर उपमहानगरपालिका': 25,

  // Bara District
  'kalaiya sub-metropolitan city': 27,
  'कलैया उपमहानगरपालिका': 27,
  'jitpur simara': 24,
  'जितपुर सिमरा': 24,

  // Rupandehi District
  'butwal sub-metropolitan city': 19,
  'बुटवल उपमहानगरपालिका': 19,
  'siddharthanagar municipality': 13,
  'सिद्धार्थनगर नगरपालिका': 13,
  'tilottama municipality': 17,
  'तिलोत्तमा नगरपालिका': 17,
  'sainamaina municipality': 11,
  'devdaha municipality': 12,
  'lumbini sanskritik': 13,

  // Banke District
  'nepalgunj sub-metropolitan city': 23,
  'नेपालगन्ज उपमहानगरपालिका': 23,
  'kohalpur municipality': 14,
  'कोहलपुर नगरपालिका': 14,

  // Dang District
  'ghorahi sub-metropolitan city': 19,
  'घोराही उपमहानगरपालिका': 19,
  'tulsipur sub-metropolitan city': 19,
  'तुलसीपुर उपमहानगरपालिका': 19,
  'lamahi municipality': 9,

  // Kailali District
  'dhangadhi sub-metropolitan city': 19,
  'धनगढी उपमहानगरपालिका': 19,
  'tikapur municipality': 9,
  'godawari / attariya': 12,
  'lamkichuha municipality': 10,
  'ghodaghodi municipality': 12,
  'bhajani municipality': 9,

  // Kanchanpur District
  'bhimdatta / mahendranagar': 19,
  'bedkot municipality': 10,
  'shuklaphanta municipality': 12,
  'krishnapur municipality': 9,
  'punarbas municipality': 11,

  // Kavrepalanchok District
  'banepa municipality': 14,
  'बनेपा नगरपालिका': 14,
  'dhulikhel municipality': 12,
  'धुलिखेल नगरपालिका': 12,
  'panauti municipality': 12,
  'पनौती नगरपालिका': 12,
  'panchkhal municipality': 13,
  'namobuddha municipality': 11,
  'mandandeupur municipality': 12,

  // Dhading District
  'nilkantha municipality': 14,
  'नीलकण्ठ नगरपालिका': 14,
  'dhunibeshi municipality': 9,
  'धुनीबेंशी नगरपालिका': 9,
  'galchhi rural municipality': 8,
  'gajuri rural municipality': 8,
  'benighat rorang': 10,

  // Nuwakot District
  'bidur municipality': 13,
  'विदुर नगरपालिका': 13,
  'belkotgadhi municipality': 13,
  'बेलकोटगढी नगरपालिका': 13,
  'kakani rural municipality': 8,
  'suryagadhi rural municipality': 5,
  'likhu rural municipality': 6,

  // Sindhupalchok District
  'chautara sangachokgadhi': 14,
  'melamchi municipality': 13,
  'barhabise municipality': 9,

  // Mustang & Manang Districts
  'gharapjhong': 5,
  'thasang': 5,
  'varagung muktikshetra': 5,
  'lomanthang': 5,
  'lo-ghekar damodarkunda': 5,
  'chame': 5,
  'narpa bhumi': 5,
};

/**
 * Calculates the exact number of wards according to the selected district and municipality.
 * Ensures realistic ward counts matching local governance laws of Nepal.
 */
export function getWardsForMunicipality(districtId: string, municipalityName?: string): number {
  const districtMax = DISTRICT_MAX_WARDS[districtId] || 12;

  if (!municipalityName || municipalityName === 'custom') {
    return districtMax;
  }

  const normalized = municipalityName.trim().toLowerCase();

  // 1. Direct dictionary match
  for (const [key, count] of Object.entries(MUNICIPALITY_WARD_COUNTS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return count;
    }
  }

  // 2. Specific major cities heuristic
  if (normalized.includes('pokhara') || normalized.includes('पोखरा')) return 33;
  if (normalized.includes('kathmandu') || normalized.includes('काठमाडौँ')) return 32;
  if (normalized.includes('birgunj') || normalized.includes('वीरगञ्ज')) return 32;
  if (normalized.includes('bharatpur') || normalized.includes('भरतपुर')) return 29;
  if (normalized.includes('lalitpur') || normalized.includes('ललितपुर')) return 29;
  if (normalized.includes('kalaiya') || normalized.includes('कलैया')) return 27;
  if (normalized.includes('janakpur') || normalized.includes('जनकपुर')) return 25;
  if (normalized.includes('jitpur') || normalized.includes('जितपुर')) return 24;
  if (normalized.includes('nepalgunj') || normalized.includes('नेपालगन्ज')) return 23;
  if (normalized.includes('dharan') || normalized.includes('धरान')) return 20;
  if (normalized.includes('itahari') || normalized.includes('इटहरी')) return 20;
  if (
    normalized.includes('butwal') ||
    normalized.includes('बुटवल') ||
    normalized.includes('biratnagar') ||
    normalized.includes('विराटनगर') ||
    normalized.includes('dhangadhi') ||
    normalized.includes('धनगढी') ||
    normalized.includes('hetauda') ||
    normalized.includes('हेटौंडा') ||
    normalized.includes('ghorahi') ||
    normalized.includes('घोराही') ||
    normalized.includes('tulsipur') ||
    normalized.includes('तुलसीपुर')
  ) {
    return 19;
  }

  // 3. Sub-metropolitan city pattern
  if (normalized.includes('sub-metropolitan') || normalized.includes('उपमहानगर')) {
    return 19;
  }

  // 4. Rural municipality (गाउँपालिका) usually has 5 to 9 wards
  if (normalized.includes('rural municipality') || normalized.includes('गाउँपालिका')) {
    return Math.min(8, districtMax);
  }

  // 5. Metropolitan city default
  if (normalized.includes('metropolitan') || normalized.includes('महानगर')) {
    return 29;
  }

  // 6. Regular Municipality default
  if (normalized.includes('municipality') || normalized.includes('नगरपालिका')) {
    return Math.min(12, districtMax);
  }

  return districtMax;
}

