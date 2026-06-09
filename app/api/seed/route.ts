import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { withDb } from '@/lib/withDb';
import User from '@/models/User';
import News from '@/models/News';
import Video from '@/models/Video';
import Astrologer from '@/models/Astrologer';
import RasiPalan from '@/models/RasiPalan';
import Temple from '@/models/Temple';
import Festival from '@/models/Festival';
import SpiritualPost from '@/models/SpiritualPost';

const rasisList = [
  { name: 'மேஷம்', key: 'aries' },
  { name: 'ரிஷபம்', key: 'taurus' },
  { name: 'மிதுனம்', key: 'gemini' },
  { name: 'கடகம்', key: 'cancer' },
  { name: 'சிம்மம்', key: 'leo' },
  { name: 'கன்னி', key: 'virgo' },
  { name: 'துலாம்', key: 'libra' },
  { name: 'விருச்சிகம்', key: 'scorpio' },
  { name: 'தனுசு', key: 'sagittarius' },
  { name: 'மகரம்', key: 'capricorn' },
  { name: 'கும்பம்', key: 'aquarius' },
  { name: 'மீனம்', key: 'pisces' }
];

export const GET = withDb(async () => {
  try {

    // 1. Seed Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Seeded default admin user');
    }

    // 2. Seed Rasi Palan if empty
    const rasiCount = await RasiPalan.countDocuments();
    if (rasiCount === 0) {
      const today = new Date().toISOString().split('T')[0];
      const rasiPredictions: any[] = [];

      rasisList.forEach((rasi) => {
        // Daily
        rasiPredictions.push({
          rasi: rasi.name,
          rasiKey: rasi.key,
          type: 'daily',
          prediction: `இன்று உங்களுக்கு சாதகமான நாளாக இருக்கும். தொழில் மற்றும் வியாபாரத்தில் நல்ல லாபம் கிடைக்கும். குடும்பத்தில் மகிழ்ச்சியும் அமைதியும் நிலவும். ஆரோக்கியத்தில் கவனம் தேவை.`,
          date: today,
          youtubeUrl: 'https://www.youtube.com/embed/n4rLz0_W_H4'
        });

        // Weekly
        rasiPredictions.push({
          rasi: rasi.name,
          rasiKey: rasi.key,
          type: 'weekly',
          prediction: `இந்த வாரம் பல புதிய வாய்ப்புகள் தேடி வரும். பொருளாதார நிலை திருப்திகரமாக இருக்கும். நண்பர்களின் உதவி கிடைக்கும். புதிய முயற்சிகளில் வெற்றி பெறுவீர்கள்.`,
          date: '2026-W23', // Example week
          youtubeUrl: 'https://www.youtube.com/embed/bIeK-Y8d83U'
        });

        // Monthly
        rasiPredictions.push({
          rasi: rasi.name,
          rasiKey: rasi.key,
          type: 'monthly',
          prediction: `இந்த மாதம் உங்களுக்கு ஏற்ற இறக்கங்கள் நிறைந்ததாக இருக்கும். கடின உழைப்பால் மட்டுமே இலக்குகளை அடைய முடியும். தேவையற்ற செலவுகளை தவிர்க்கவும். இறை வழிபாடு நன்மை தரும்.`,
          date: '2026-06',
          youtubeUrl: 'https://www.youtube.com/embed/N-0Qc0Rk174'
        });

        // Guru Peyarchi
        rasiPredictions.push({
          rasi: rasi.name,
          rasiKey: rasi.key,
          type: 'peyarchi_guru',
          prediction: `குரு பகவானின் பெயர்ச்சி உங்களுக்கு புதிய திருப்பங்களை ஏற்படுத்தும். பணப்புழக்கம் அதிகரிக்கும். குடும்ப சுப காரியங்கள் கைகூடும். உயர் பதவிகள் தேடி வரும்.`,
          date: '2026',
          youtubeUrl: 'https://www.youtube.com/embed/Pj15b63xszk'
        });

        // Sani Peyarchi
        rasiPredictions.push({
          rasi: rasi.name,
          rasiKey: rasi.key,
          type: 'peyarchi_sani',
          prediction: `சனி பகவான் பெயர்ச்சியால் சில சவால்களை சந்திக்க நெரிடலாம். எனினும் பொறுமையுடனும் விடாமுயற்சியுடனும் செயல்பட்டால் வெற்றி நிச்சயம். சனிக்கிழமைகளில் எள் தீபம் ஏற்றி வழிபடவும்.`,
          date: '2026',
          youtubeUrl: 'https://www.youtube.com/embed/AETFvQonfV8'
        });

        // Tamil New Year
        rasiPredictions.push({
          rasi: rasi.name,
          rasiKey: rasi.key,
          type: 'puthandu_tamil',
          prediction: `தமிழ்ப் புத்தாண்டு உங்களுக்கு ஆரோக்கியமும் ஐஸ்வர்யமும் தரும் ஆண்டாக அமையட்டும். தடைபட்ட காரியங்கள் அனைத்தும் விலகும். சுப செய்திகள் வந்து சேரும்.`,
          date: '2026',
          youtubeUrl: 'https://www.youtube.com/embed/kR1iG24iZpE'
        });

        // English New Year
        rasiPredictions.push({
          rasi: rasi.name,
          rasiKey: rasi.key,
          type: 'puthandu_english',
          prediction: `புதிய ஆங்கிலப் புத்தாண்டு பல புதிய சாதனைகளை புரிய வைக்கும். வேலையில் முன்னேற்றம் காண்பீர்கள். புதிய சொத்துக்கள் வாங்கும் யோகம் உண்டாகும்.`,
          date: '2026',
          youtubeUrl: 'https://www.youtube.com/embed/n4rLz0_W_H4'
        });
      });

      await RasiPalan.insertMany(rasiPredictions);
      console.log('Seeded Rasi Palan');
    }

    // 3. Clear and Seed News
    await News.deleteMany({});
    const mockNews = [
      {
        titleTamil: 'வைகாசி விசாக பெருவிழா: திருச்செந்தூர் முருகன் கோயிலில் பக்தர்கள் அலைமோதும் கூட்டம்!',
        titleEnglish: 'Vaikasi Visakam Festival: Huge crowd of devotees at Thiruchendur Murugan Temple!',
        descriptionTamil: 'வைகாசி விசாக திருநாளை முன்னிட்டு அறுபடை வீடுகளில் ஒன்றான திருச்செந்தூர் சுப்பிரமணிய சுவாமி திருக்கோயிலில் ஆயிரக்கணக்கான பக்தர்கள் குவிந்துள்ளனர். இன்று காலை முதலே நீண்ட வரிசையில் நின்று முருகப் பெருமானை தரிசனம் செய்து வருகின்றனர். பக்தர்கள் வசதிக்காக சிறப்பு போக்குவரத்து மற்றும் குடிநீர் வசதிகள் செய்யப்பட்டுள்ளன.',
        descriptionEnglish: 'Thousands of devotees gathered at the Thiruchendur Subramanya Swamy Temple, one of the six abodes of Lord Murugan, for Vaikasi Visakam. Devotees have been standing in long lines since morning to get darshan. Special transport and drinking water facilities have been arranged.',
        category: 'Spiritual',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
        isImportant: true,
        isLatest: true,
        publishDate: new Date(),
      },
      {
        titleTamil: 'மதுரை மீனாட்சி அம்மன் கோவிலில் வசந்த உற்சவம் ஜூன் 10 முதல் தொடக்கம்',
        titleEnglish: 'Madurai Meenakshi Temple Vasantha Utsavam Starts from June 10',
        descriptionTamil: 'உலக புகழ்பெற்ற மதுரை மீனாட்சி சுந்தரேஸ்வரர் திருக்கோவிலில் இந்த ஆண்டுக்கான கோடை வசந்த திருவிழா ஜூன் 10 ஆம் தேதி கொடியேற்றத்துடன் தொடங்குகிறது. 10 நாட்கள் நடைபெறும் இத்திருவிழாவில் தினமும் மீனாட்சி அம்மனும் சுந்தரேஸ்வரரும் பல்வேறு வாகனங்களில் எழுந்தருளி வீதி உலா வருவர்.',
        descriptionEnglish: 'The annual summer Vasantha Utsavam of the world-famous Madurai Meenakshi Sundareswarar Temple begins with flag hoisting on June 10. During the 10-day festival, Goddess Meenakshi and Lord Sundareswarar will progress in street processions daily.',
        category: 'Spiritual',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800',
        isImportant: true,
        isLatest: false,
        publishDate: new Date(),
      },
      {
        titleTamil: 'அதிநவீன தொழில்நுட்பங்களுடன் இஸ்ரோவின் புதிய செயற்கைக்கோள் ஏவ தயாராகிறது',
        titleEnglish: 'ISRO New High-Tech Satellite Prepared for Launch',
        descriptionTamil: 'இந்திய விண்வெளி ஆராய்ச்சி நிறுவனம் (இஸ்ரோ) தகவல் தொடர்பு மற்றும் புவி கண்காணிப்பு வசதிக்காக அதிநவீன தொழில்நுட்பங்களுடன் வடிவமைக்கப்பட்ட புதிய செயற்கைக்கோளை விண்ணில் செலுத்த அனைத்து ஏற்பாடுகளையும் செய்துள்ளது. இது நாட்டின் இணைய வேகத்தை கணிசமாக அதிகரிக்கும்.',
        descriptionEnglish: 'The Indian Space Research Organisation (ISRO) has made all arrangements to launch a new high-tech satellite designed for communications and earth observation. This will significantly boost internet speeds across the country.',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=800',
        isImportant: false,
        isLatest: true,
        publishDate: new Date(),
      },
      {
        titleTamil: 'கிரிக்கெட் உலகக்கோப்பை: இந்திய அணி அபார வெற்றி பெற்று அரையிறுதிக்கு தகுதி பெற்றது',
        titleEnglish: 'Cricket World Cup: Indian Team Enters Semifinals with Spectacular Victory',
        descriptionTamil: 'இன்றைய பரபரப்பான கிரிக்கெட் போட்டியில் இந்திய அணி அபார ஆட்டத்தை வெளிப்படுத்தி வெற்றி பெற்று அரையிறுதிச் சுற்றுக்கு முன்னேறியுள்ளது. கடைசி ஓவரில் பந்துவீச்சாளர்கள் சிறப்பாக செயல்பட்டு அணியின் வெற்றியை உறுதி செய்தனர்.',
        descriptionEnglish: 'In today\'s thrilling cricket match, the Indian team delivered a spectacular performance to win and advance to the semifinal round. The bowlers performed exceptionally well in the final over to secure victory.',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1540747737956-378724044282?auto=format&fit=crop&q=80&w=800',
        isImportant: false,
        isLatest: true,
        publishDate: new Date(),
      },
      {
        titleTamil: 'மாநில அளவிலான யோகா போட்டிகளில் பள்ளி மாணவர்கள் சாதனை',
        titleEnglish: 'School Students Achieve Success in State-Level Yoga Competition',
        descriptionTamil: 'தமிழக அளவில் நடைபெற்ற பள்ளி மாணவர்களுக்கான யோகா போட்டிகளில் அரசு பள்ளி மாணவர்கள் பல்வேறு தங்கப் பதக்கங்களை வென்று சாதனை படைத்துள்ளனர். இவர்களுக்கு கல்வித்துறை அதிகாரிகள் வாழ்த்துக்களை தெரிவித்துள்ளனர்.',
        descriptionEnglish: 'Government school students won several gold medals and achieved success at the state-level yoga competitions held for school children. Education department officials extended their congratulations.',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        isImportant: false,
        isLatest: true,
        publishDate: new Date(),
      },
      {
        titleTamil: 'பிரபல நடிகரின் புதிய திரைப்படம் பாக்ஸ் ஆபீஸில் சாதனை படைத்து வருகிறது',
        titleEnglish: 'Popular Actor\'s New Film Creates Box Office Records',
        descriptionTamil: 'கடந்த வாரம் திரையரங்குகளில் வெளியான முன்னணி நடிகரின் திரைப்படம் உலகம் முழுவதும் பெரும் வரவேற்பைப் பெற்று வசூல் சாதனை படைத்து வருகிறது. படத்தின் கதை மற்றும் இசை ரசிகர்களை மிகவும் கவர்ந்துள்ளது.',
        descriptionEnglish: 'The movie of a leading actor released in theaters last week has received overwhelming response worldwide, breaking box office records. The film\'s story and music have deeply captivated fans.',
        category: 'Cinema',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
        isImportant: true,
        isLatest: false,
        publishDate: new Date(),
      },
      {
        titleTamil: 'மாநில பட்ஜெட்டில் விவசாயிகளுக்கு புதிய சலுகைகள் அறிவிப்பு',
        titleEnglish: 'New Benefits for Farmers Announced in State Budget',
        descriptionTamil: 'தமிழக சட்டமன்றத்தில் தாக்கல் செய்யப்பட்ட பட்ஜெட்டில், விவசாயிகளின் பயிர் கடன்களை தள்ளுபடி செய்யவும், புதிய நீர்ப்பாசன திட்டங்களை செயல்படுத்தவும் முக்கிய நிதியுதவிகள் ஒதுக்கப்பட்டு அறிவிக்கப்பட்டுள்ளன.',
        descriptionEnglish: 'In the budget presented in the state assembly, key financial allocations have been announced to waive crop loans for farmers and implement new irrigation schemes.',
        category: 'Politics',
        image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800',
        isImportant: true,
        isLatest: false,
        publishDate: new Date(),
      },
      {
        titleTamil: 'ஸ்ரீ வெங்கடேச சுப்ரபாதம் | பக்தி பாடல் வீடியோ',
        titleEnglish: 'Sri Venkateswara Suprabhatam | Devotional Video',
        descriptionTamil: 'காலை நேரத்தை தெய்வீகமாகத் தொடங்க திருப்பதி வெங்கடாசலபதியின் சுப்ரபாதம் பாடல். இதனை தினசரி கேட்டு எம்பெருமான் அருளைப் பெறலாம்.',
        descriptionEnglish: 'Sri Venkateswara Suprabhatam to start your morning on a divine note. Listen to this daily and seek the blessings of the Lord.',
        category: 'Spiritual',
        image: 'https://img.youtube.com/vi/kR1iG24iZpE/hqdefault.jpg',
        youtubeUrl: 'https://www.youtube.com/watch?v=kR1iG24iZpE',
        youtubeVideoId: 'kR1iG24iZpE',
        isImportant: false,
        isLatest: true,
        publishDate: new Date(),
      },
      {
        titleTamil: 'கந்த சஷ்டி கவசம் | முருகனின் அருள் தரும் கவசம்',
        titleEnglish: 'Kandha Sashti Kavasam | Lord Murugan Devotional Song',
        descriptionTamil: 'முருகப் பெருமானின் கந்த சஷ்டி கவசம் பாடல். தீவினைகளை நீக்கி நல்வாழ்வு தரும் தெய்வீகப் பாடல்.',
        descriptionEnglish: 'Lord Murugan\'s Kandha Sashti Kavasam song. A divine hymn that removes negativity and brings good fortune.',
        category: 'Spiritual',
        image: 'https://img.youtube.com/vi/n4rLz0_W_H4/hqdefault.jpg',
        youtubeUrl: 'https://www.youtube.com/watch?v=n4rLz0_W_H4',
        youtubeVideoId: 'n4rLz0_W_H4',
        isImportant: true,
        isLatest: true,
        publishDate: new Date(),
      }
    ];
    await News.insertMany(mockNews);
    console.log('Seeded Bilingual News');


    // 4. Seed Videos if empty
    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      const mockVideos = [
        {
          title: 'கந்த சஷ்டி கவசம் | கந்தன் புகழ்பாடும் பக்திப் பாடல்கள்',
          youtubeUrl: 'https://www.youtube.com/embed/n4rLz0_W_H4',
          description: 'தினமும் கேட்க வேண்டிய முருகனின் பக்திப் பாடல்கள் மற்றும் கந்த சஷ்டி கவசம்.',
          thumbnail: 'https://img.youtube.com/vi/n4rLz0_W_H4/0.jpg'
        },
        {
          title: 'மகா மிருத்யுஞ்ஜய மந்திரம் | 108 முறை ஜெபம்',
          youtubeUrl: 'https://www.youtube.com/embed/bIeK-Y8d83U',
          description: 'ஆரோக்கியமும் நீண்ட ஆயுளும் தரும் சிவபெருமானின் மகா மிருத்யுஞ்ஜய மந்திரம்.',
          thumbnail: 'https://img.youtube.com/vi/bIeK-Y8d83U/0.jpg'
        },
        {
          title: 'விஷ்ணு சஹஸ்ரநாமம் | மன அமைதி தரும் ஸ்லோகம்',
          youtubeUrl: 'https://www.youtube.com/embed/N-0Qc0Rk174',
          description: 'ஸ்ரீ விஷ்ணு சஹஸ்ரநாம ஸ்தோத்திரம் வரிகளுடன் பக்திப் பெருக்குடன்.',
          thumbnail: 'https://img.youtube.com/vi/N-0Qc0Rk174/0.jpg'
        },
        {
          title: 'லலிதா சஹஸ்ரநாமம் | அன்னை அம்பிகையின் அருள் பெற',
          youtubeUrl: 'https://www.youtube.com/embed/Pj15b63xszk',
          description: 'அம்பாளின் அருளை முழுமையாகப் பெற தினமும் லலிதா சஹஸ்ரநாமம் கேட்கலாம்.',
          thumbnail: 'https://img.youtube.com/vi/Pj15b63xszk/0.jpg'
        },
        {
          title: 'ஸ்ரீ வெங்கடேச சுப்ரபாதம் | காலை நேர பக்திப் பாடல்',
          youtubeUrl: 'https://www.youtube.com/embed/kR1iG24iZpE',
          description: 'காலை நேரத்தை தெய்வீகமாகத் தொடங்க திருப்பதி வெங்கடாசலபதியின் சுப்ரபாதம்.',
          thumbnail: 'https://img.youtube.com/vi/kR1iG24iZpE/0.jpg'
        },
        {
          title: 'ஹனுமான் சாலிசா | துன்பங்கள் போக்கும் ராம தூதன்',
          youtubeUrl: 'https://www.youtube.com/embed/AETFvQonfV8',
          description: 'பயம் மற்றும் தடைகள் நீங்கி வெற்றி பெற ஹனுமான் சாலிசா பாடல் கேட்கலாம்.',
          thumbnail: 'https://img.youtube.com/vi/AETFvQonfV8/0.jpg'
        }
      ];
      await Video.insertMany(mockVideos);
      console.log('Seeded Videos');
    }

    // 5. Seed Astrologers if empty
    const astrologerCount = await Astrologer.countDocuments();
    if (astrologerCount === 0) {
      const mockAstrologers = [
        {
          name: 'ஜோதிட ரத்னா ராமலிங்கம்',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          specialty: 'வேத ஜோதிடம் & ஜாதகம் கணித்தல்',
          experience: 25,
          phone: '+91 9876543210',
          email: 'ramalingam@bakthiprime.com'
        },
        {
          name: 'சுவாமி பிரகாஷானந்தா',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
          specialty: 'பிரசன்ன ஜோதிடம் & வாஸ்து சாஸ்திரம்',
          experience: 30,
          phone: '+91 9876543211',
          email: 'prakash@bakthiprime.com'
        },
        {
          name: 'ஜோதிட சிரோமணி மீனாட்சி',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
          specialty: 'எண் கணிதம் (Numerology) & கைரேகை நிபுணர்',
          experience: 18,
          phone: '+91 9876543212',
          email: 'meenatchi@bakthiprime.com'
        }
      ];
      await Astrologer.insertMany(mockAstrologers);
      console.log('Seeded Astrologers');
    }

    // 6. Seed Temples if empty
    const templeCount = await Temple.countDocuments();
    if (templeCount === 0) {
      const mockTemples = [
        {
          name: 'தஞ்சாவூர் பெருவுடையார் கோவில்',
          location: 'தஞ்சாவூர், தமிழ்நாடு',
          deity: 'பிரகதீஸ்வரர் (சிவன்)',
          history: 'ராஜராஜ சோழனால் கட்டப்பட்ட ஆயிரம் ஆண்டுகள் பழமையான சோழர் கால கட்டிடக்கலை அற்புதம். இக்கோவிலின் விமானத்தின் நிழல் தரையில் விழுவதில்லை என்ற புராண பெருமை கொண்டது.',
          image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
          timings: 'காலை 6.00 மணி முதல் மதியம் 12.30 மணி வரை, மாலை 4.00 மணி முதல் இரவு 8.30 மணி வரை'
        },
        {
          name: 'மதுரை மீனாட்சி சுந்தரேஸ்வரர் கோவில்',
          location: 'மதுரை, தமிழ்நாடு',
          deity: 'மீனாட்சி அம்மன், சுந்தரேஸ்வரர்',
          history: 'பாண்டிய மன்னர்களால் கட்டப்பட்ட கலைநயமிக்க சிற்பங்களைக் கொண்ட கோவில். இதன் பொற்றாமரைக்குளமும் ஆயிரம் கால் மண்டபமும் மிகவும் புகழ்பெற்றவை.',
          image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800',
          timings: 'காலை 5.00 மணி முதல் மதியம் 12.30 மணி வரை, மாலை 4.00/ இரவு 9.30 மணி வரை'
        }
      ];
      await Temple.insertMany(mockTemples);
      console.log('Seeded Temples');
    }

    // 7. Seed Festivals if empty
    const festivalCount = await Festival.countDocuments();
    if (festivalCount === 0) {
      const mockFestivals = [
        {
          name: 'மகா சிவராத்திரி',
          date: 'மாசி மாதம் (பிப்ரவரி/மார்ச்)',
          significance: 'சிவபெருமானுக்கு அர்ப்பணிக்கப்பட்ட உன்னதமான விரத நாள். இந்நாளில் இரவெல்லாம் விழித்திருந்து நான்கு கால பூசைகளில் சிவபெருமானை வழிபட்டால் சகல பாவங்களும் நீங்கும்.',
          rituals: 'சிவ அர்ச்சனை, ருத்ர பாராயணம், இரவு முழுவதும் விழித்திருத்தல், உபவாசம்.',
          image: 'https://images.unsplash.com/photo-1609137982420-b18a56d68ae6?auto=format&fit=crop&q=80&w=800'
        },
        {
          name: 'தைப்பொங்கல் பெருவிழா',
          date: 'தை 1 (ஜனவரி 14/15)',
          significance: 'இயற்கைக்கும் சூரியனுக்கும் உழவர் பெருமக்கள் நன்றி செலுத்தும் அறுவடைத் திருநாள். புதுப் பானையில் பொங்கலிட்டு மங்களகரமாகக் கொண்டாடப்படுகிறது.',
          rituals: 'சூரிய நமஸ்காரம், புது பானையில் பொங்கலிடுதல், மாட்டுப் பொங்கல் வழிபாடு.',
          image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
        }
      ];
      await Festival.insertMany(mockFestivals);
      console.log('Seeded Festivals');
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully! Default admin created (user: admin, pass: admin123)'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
});
