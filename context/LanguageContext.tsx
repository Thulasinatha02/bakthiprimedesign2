'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ta' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Navigation / Header / General UI
  'முகப்பு': { ta: 'முகப்பு', en: 'Home' },
  'ஜோதிடர்கள்': { ta: 'ஜோதிடர்கள்', en: 'Astrologers' },
  'பொருத்தம்': { ta: 'பொருத்தம்', en: 'Porutham' },
  'ஆன்மிகம்': { ta: 'ஆன்மிகம்', en: 'Spiritual' },
  'ஆன்மீகம்': { ta: 'ஆன்மீகம்', en: 'Spiritual' },
  'ஜோதிடம்': { ta: 'ஜோதிடம்', en: 'Astrology' },
  'கோவில்': { ta: 'கோவில்', en: 'Temples' },
  'திருவிழா': { ta: 'திருவிழா', en: 'Festivals' },
  'ஏனையவை': { ta: 'ஏனையவை', en: 'Others' },
  'விளையாட்டு': { ta: 'விளையாட்டு', en: 'Sports' },
  'அரசியல்': { ta: 'அரசியல்', en: 'Politics' },
  'கல்வி': { ta: 'கல்வி', en: 'Education' },
  'தொழில்நுட்பம்': { ta: 'தொழில்நுட்பம்', en: 'Technology' },
  'சினிமா': { ta: 'சினிமா', en: 'Cinema' },
  'அனைத்து': { ta: 'அனைத்து', en: 'All' },
  'அனைத்தும்': { ta: 'அனைத்தும்', en: 'All' },
  'All': { ta: 'அனைத்தும்', en: 'All' },
  'Sports': { ta: 'விளையாட்டு', en: 'Sports' },
  'Politics': { ta: 'அரசியல்', en: 'Politics' },
  'Education': { ta: 'கல்வி', en: 'Education' },
  'Spiritual': { ta: 'ஆன்மீகம்', en: 'Spiritual' },
  'Technology': { ta: 'தொழில்நுட்பம்', en: 'Technology' },
  'Cinema': { ta: 'சினிமா', en: 'Cinema' },
  'அண்மை செய்திகள்': { ta: 'அண்மை செய்திகள்', en: 'Latest News' },
  'Latest News': { ta: 'அண்மை செய்திகள்', en: 'Latest News' },
  'Important News': { ta: 'முக்கிய செய்திகள்', en: 'Important News' },
  'View All': { ta: 'மேலும் காண்க', en: 'View All' },
  'மேலும் காண்க': { ta: 'மேலும் காண்க', en: 'View All' },
  'Read More': { ta: 'மேலும் வாசிக்க', en: 'Read More' },
  'மேலும் வாசிக்க': { ta: 'மேலும் வாசிக்க', en: 'Read More' },
  'YouTube News Videos': { ta: 'வீடியோ செய்திகள்', en: 'Video News' },
  'வீடியோ செய்திகள்': { ta: 'வீடியோ செய்திகள்', en: 'Video News' },
  'செய்திகள்': { ta: 'செய்திகள்', en: 'News' },
  'விளையாட்டு செய்திகள்': { ta: 'விளையாட்டு செய்திகள்', en: 'Sports News' },
  'அரசியல் செய்திகள்': { ta: 'அரசியல் செய்திகள்', en: 'Political News' },
  'கல்வி செய்திகள்': { ta: 'கல்வி செய்திகள்', en: 'Education News' },
  'ஆன்மீக செய்திகள்': { ta: 'ஆன்மீக செய்திகள்', en: 'Spiritual News' },
  'தொழில்நுட்ப செய்திகள்': { ta: 'தொழில்நுட்ப செய்திகள்', en: 'Technology News' },
  'சினிமா செய்திகள்': { ta: 'சினிமா செய்திகள்', en: 'Cinema News' },
  'ராசிபலன்': { ta: 'ராசிபலன்', en: 'Horoscope' },
  'தேடுக...': { ta: 'தேடுக...', en: 'Search...' },
  'நிர்வாகி': { ta: 'நிர்வாகி', en: 'Admin' },
  'ADMIN': { ta: 'நிர்வாகி', en: 'ADMIN' },
  'DASHBOARD': { ta: 'கட்டுப்பாட்டு பலகை', en: 'DASHBOARD' },

  // Homepage Titles & Tickers
  'ராசி பலன்கள்': { ta: 'ராசி பலன்கள்', en: 'Horoscopes' },
  'இன்றைய 12 ராசிபலன்கள் (Daily Horoscope)': { ta: 'இன்றைய 12 ராசிபலன்கள் (Daily Horoscope)', en: 'Daily Horoscopes (12 Zodiacs)' },
  'பலன்கள் காண்க →': { ta: 'பலன்கள் காண்க →', en: 'View Forecast →' },
  'முக்கிய செய்திகள் (Important News)': { ta: 'முக்கிய செய்திகள் (Important News)', en: 'Important News' },
  'முக்கிய செய்திகள்': { ta: 'முக்கிய செய்திகள்', en: 'Important News' },
  'பொதுச்செய்தி': { ta: 'பொதுச்செய்தி', en: 'General' },
  'பக்தி கானங்கள்': { ta: 'பக்தி கானங்கள்', en: 'Devotional Hymns' },
  'பக்தி வீடியோக்கள் (Devotional Videos)': { ta: 'பக்தி வீடியோக்கள் (Devotional Videos)', en: 'Devotional Videos' },
  'இணையதளத்திலேயே நேரடியாக கண்டுகளியுங்கள்': { ta: 'இணையதளத்திலேயே நேரடியாக கண்டுகளியுங்கள்', en: 'Watch directly on our website' },

  // Video Section / Player
  'காணொளிகள் ஏற்றப்படுகின்றன...': { ta: 'காணொளிகள் ஏற்றப்படுகின்றன...', en: 'Loading videos...' },
  'காணொளிகள் எதுவும் பதிவிடப்படவில்லை. புதிய வீடியோ சேர்க்கவும்.': { ta: 'காணொளிகள் எதுவும் பதிவிடப்படவில்லை. புதிய வீடியோ சேர்க்கவும்.', en: 'No videos posted yet.' },
  'விளக்கம் ஏதுமில்லை.': { ta: 'விளக்கம் ஏதுமில்லை.', en: 'No description available.' },
  'தெய்வீக அருள் வழங்கும் பக்தி பாடல் தொகுப்பு.': { ta: 'தெய்வீக அருள் வழங்கும் பக்தி பாடல் தொகுப்பு.', en: 'Divine devotional song collection providing blessings.' },

  // Astrologers Page
  'ஜோதிட நிபுணர்கள்': { ta: 'ஜோதிட நிபுணர்கள்', en: 'Astrology Specialists' },
  'எம்முடைய தகுதி வாய்ந்த ஜோதிடர்கள் (Astrologers)': { ta: 'எம்முடைய தகுதி வாய்ந்த ஜோதிடர்கள் (Astrologers)', en: 'Our Qualified Astrologers' },
  'உங்கள் வாழ்வின் அனைத்து பிரச்சனைகளுக்கும் எங்கள் அனுபவம் வாய்ந்த ஜோதிட நிபுணர்களிடம் கலந்தாலோசித்து சிறந்த தீர்வு பெறலாம்.': { 
    ta: 'உங்கள் வாழ்வின் அனைத்து பிரச்சனைகளுக்கும் எங்கள் அனுபவம் வாய்ந்த ஜோதிட நிபுணர்களிடம் கலந்தாலோசித்து சிறந்த தீர்வு பெறலாம்.', 
    en: 'Consult with our experienced astrologers to get the best solutions for all your life problems.' 
  },
  'சரிபார்க்கப்பட்டது': { ta: 'சரிபார்க்கப்பட்டது', en: 'Verified' },
  'சிறப்புத் துறை:': { ta: 'சிறப்புத் துறை:', en: 'Specialty:' },
  'அனுபவம்:': { ta: 'அனுபவம்:', en: 'Experience:' },
  'ஆண்டுகள்': { ta: 'ஆண்டுகள்', en: 'Years' },
  'அழைக்க': { ta: 'அழைக்க', en: 'Call Now' },
  'கலந்தாலோசிக்க': { ta: 'கலந்தாலோசிக்க', en: 'Consult' },
  'தற்சமயம் ஜோதிடர்கள் யாரும் பதிவிடப்படவில்லை.': { ta: 'தற்சமயம் ஜோதிடர்கள் யாரும் பதிவிடப்படவில்லை.', en: 'No astrologers registered at the moment.' },

  // Porutham / Compatibility
  'திருமணப் பொருத்தம் (Marriage Compatibility)': { ta: 'திருமணப் பொருத்தம் (Marriage Compatibility)', en: 'Marriage Compatibility (Porutham)' },
  'ஆண் மற்றும் பெண்ணின் ராசிகளைத் தேர்வு செய்து, திருமணப் பொருத்தத்தை எளிதாகக் கண்டறியுங்கள்.': { 
    ta: 'ஆண் மற்றும் பெண்ணின் ராசிகளைத் தேர்வு செய்து, திருமணப் பொருத்தத்தை எளிதாகக் கண்டறியுங்கள்.', 
    en: 'Choose the boy\'s and girl\'s rasi to check marriage compatibility easily.' 
  },
  'ராசி பொருத்தம் காணல்': { ta: 'ராசி பொருத்தம் காணல்', en: 'Find Rasi Match' },
  'ஆண் ராசி (Boy\'s Rasi)': { ta: 'ஆண் ராசி (Boy\'s Rasi)', en: 'Boy\'s Rasi' },
  'பெண் ராசி (Girl\'s Rasi)': { ta: 'பெண் ராசி (Girl\'s Rasi)', en: 'Girl\'s Rasi' },
  'தேர்வு செய்க...': { ta: 'தேர்வு செய்க...', en: 'Select...' },
  'கணக்கிடப்படுகிறது...': { ta: 'கணக்கிடப்படுகிறது...', en: 'Calculating...' },
  'பொருத்தம் காண்க': { ta: 'பொருத்தம் காண்க', en: 'Check Compatibility' },
  'கிரக நிலைகள் மற்றும் நட்சத்திர பொருத்தங்கள் ஆராயப்படுகின்றன...': { 
    ta: 'கிரக நிலைகள் மற்றும் நட்சத்திர பொருத்தங்கள் ஆராயப்படுகின்றன...', 
    en: 'Analyzing planetary positions and star matches...' 
  },
  'ராசிகளைத் தேர்வு செய்து "பொருத்தம் காண்க" பொத்தானை அழுத்தவும்.': { 
    ta: 'ராசிகளைத் தேர்வு செய்து "பொருத்தம் காண்க" பொத்தானை அழுத்தவும்.', 
    en: 'Please select Rasis and click "Check Compatibility".' 
  },
  'பொருத்த முடிவு': { ta: 'பொருத்த முடிவு', en: 'Match Result' },
  'பொருத்தம்:': { ta: 'பொருத்தம்:', en: 'Compatibility:' },
  'பொருத்தங்களின் விவரம்:': { ta: 'பொருத்தங்களின் விவரம்:', en: 'Match Details:' },
  'ஆம்': { ta: 'ஆம்', en: 'Yes' },
  'இல்லை': { ta: 'இல்லை', en: 'No' },
  'உத்தமம் (Excellent Match)': { ta: 'உத்தமம் (Excellent Match)', en: 'Excellent Match' },
  'மிக உத்தமம் (Very Good Match)': { ta: 'மிக உத்தமம் (Very Good Match)', en: 'Very Good Match' },
  'மத்திமம் (Average Match)': { ta: 'மத்திமம் (Average Match)', en: 'Average Match' },
  'அதமம் (Weak Match)': { ta: 'அதமம் (Weak Match)', en: 'Weak Match' },
  'ஏக ராசி பொருத்தம் மிக நன்று. தம்பதியினருக்கு இடையே நல்ல புரிந்துணர்வும் ஒற்றுமையும் நிலவும்.': {
    ta: 'ஏக ராசி பொருத்தம் மிக நன்று. தம்பதியினருக்கு இடையே நல்ல புரிந்துணர்வும் ஒற்றுமையும் நிலவும்.',
    en: 'Same Rasi match is very good. Good understanding and unity will prevail between the couple.'
  },
  'இருவருக்கும் இடையே மனப் பொருத்தம், உடல் நலம், குழந்தை பேறு மற்றும் செல்வ வளம் அனைத்தும் சிறப்பாக அமையும்.': {
    ta: 'இருவருக்கும் இடையே மனப் பொருத்தம், உடல் நலம், குழந்தை பேறு மற்றும் செல்வ வளம் அனைத்தும் சிறப்பாக அமையும்.',
    en: 'Mental match, health, children, and wealth will all shape up wonderfully between the two.'
  },
  'சில பொருத்தங்கள் சாதகமாகவும், சில சற்றே பலவீனமாகவும் உள்ளன. குடும்பத்தில் சகிப்புத்தன்மை மற்றும் பரஸ்பர விட்டுக் கொடுத்தல் தேவை.': {
    ta: 'சில பொருத்தங்கள் சாதகமாகவும், சில சற்றே பலவீனமாகவும் உள்ளன. குடும்பத்தில் சகிப்புத்தன்மை மற்றும் பரஸ்பர விட்டுக் கொடுத்தல் தேவை.',
    en: 'Some matches are favorable, while others are slightly weak. Tolerance and mutual compromise are needed in the family.'
  },
  'இருவருக்கும் இடையே கருத்து வேறுபாடுகள் தோன்ற வாய்ப்புகள் அதிகம். திருமணம் செய்வதற்கு முன் மூத்த ஜோதிடரிடம் முழுமையான ஜாதகப் பொருத்தம் பார்ப்பது அவசியமாகும்.': {
    ta: 'இருவருக்கும் இடையே கருத்து வேறுபாடுகள் தோன்ற வாய்ப்புகள் அதிகம். திருமணம் செய்வதற்கு முன் மூத்த ஜோதிடரிடம் முழுமையான ஜாதகப் பொருத்தம் பார்ப்பது அவசியமாகும்.',
    en: 'There is a high chance of differences of opinion. It is essential to consult a senior astrologer for complete horoscope matching before marriage.'
  },
  'தினப் பொருத்தம் (Health & Longevity)': { ta: 'தினப் பொருத்தம் (Health & Longevity)', en: 'Dina Porutham (Health & Longevity)' },
  'ஆரோக்கியமான மற்றும் நீண்ட ஆயுளுக்கான தகுதி.': { ta: 'ஆரோக்கியமான மற்றும் நீண்ட ஆயுளுக்கான தகுதி.', en: 'Indicates good health and longevity.' },
  'கணப் பொருத்தம் (Temperament)': { ta: 'கணப் பொருத்தம் (Temperament)', en: 'Gana Porutham (Temperament)' },
  'குணங்கள் மற்றும் மனோபாவங்களின் இணக்கம்.': { ta: 'குணங்கள் மற்றும் மனோபாவங்களின் இணக்கம்.', en: 'Indicates alignment of character and temperament.' },
  'மகேந்திரப் பொருத்தம் (Lineage)': { ta: 'மகேந்திரப் பொருத்தம் (Lineage)', en: 'Mahendra Porutham (Lineage / Children)' },
  'புத்திர பாக்கியம் மற்றும் வம்ச வளர்ச்சி.': { ta: 'புத்திர பாக்கியம் மற்றும் வம்ச வளர்ச்சி.', en: 'Indicates blessing of children and lineage growth.' },
  'ஸ்திரீ தீர்க்கப் பொருத்தம் (Prosperity)': { ta: 'ஸ்திரீ தீர்க்கப் பொருத்தம் (Prosperity)', en: 'Stree Deergha Porutham (Prosperity)' },
  'மனைவிக்கு தீர்க்க சுமங்கலி பாக்கியம் மற்றும் குடும்ப வளம்.': { ta: 'மனைவிக்கு தீர்க்க சுமங்கலி பாக்கியம் மற்றும் குடும்ப வளம்.', en: 'Indicates longevity of the wife and family prosperity.' },
  'யோனிப் பொருத்தம் (Physical Harmony)': { ta: 'யோனிப் பொருத்தம் (Physical Harmony)', en: 'Yoni Porutham (Physical Harmony)' },
  'உடல் ரீதியான நல்ல ஒத்திசைவு.': { ta: 'உடல் ரீதியான நல்ல ஒத்திசைவு.', en: 'Indicates good physical harmony.' },

  // Horoscope Pages
  'கோள்களின் கணிப்பு': { ta: 'கோள்களின் கணிப்பு', en: 'Planetary Predictions' },
  'பலன்கள் & பரிகாரங்கள்': { ta: 'பலன்கள் & பரிகாரங்கள்', en: 'Predictions & Remedies' },
  'வீடியோ பலன் கணிப்பு': { ta: 'வீடியோ பலன் கணிப்பு', en: 'Video Forecast' },
  'கருத்துகள்': { ta: 'கருத்துகள்', en: 'Comments' },
  'கருத்து எழுதவும்': { ta: 'கருத்து எழுதவும்', en: 'Write a Comment' },
  'பெயர் (Name)': { ta: 'பெயர் (Name)', en: 'Name' },
  'கருத்து (Comment)': { ta: 'கருத்து (Comment)', en: 'Comment' },
  'பதிவிடு': { ta: 'பதிவிடு', en: 'Post Comment' },
  'முதல் கருத்தைப் பதியுங்கள்!': { ta: 'முதல் கருத்தைப் பதியுங்கள்!', en: 'Be the first to comment!' },
  'குறிப்பு: இங்கு கூறப்பட்டுள்ள பலன்கள் பொதுவானவை.': { 
    ta: 'குறிப்பு: இங்கு கூறப்பட்டுள்ள பலன்கள் பொதுவானவை. துல்லியமான பலன்களுக்கு உங்களது பிறந்த ஜாதகத்தை அனுபவமிக்க ஜோதிடர்களிடம் காண்பிப்பது அவசியமாகும்.', 
    en: 'Note: These predictions are general. For precise horoscope charts, consult with qualified astrologers.' 
  },
  'தற்சமயம் பலன்கள் பதிவிடப்படவில்லை.': { ta: 'தற்சமயம் பலன்கள் பதிவிடப்படவில்லை.', en: 'Predictions not posted yet for this period.' },
  'தினசரி ராசிபலன்': { ta: 'தினசரி ராசிபலன்', en: 'Daily Horoscope' },
  'வாராந்திர ராசிபலன்': { ta: 'வாராந்திர ராசிபலன்', en: 'Weekly Horoscope' },
  'மாதாந்திர ராசிபலன்': { ta: 'மாதாந்திர ராசிபலன்', en: 'Monthly Horoscope' },
  'குரு பெயர்ச்சி': { ta: 'குரு பெயர்ச்சி', en: 'Guru Transit' },
  'சனி பெயர்ச்சி': { ta: 'சனி பெயர்ச்சி', en: 'Saturn Transit' },
  'தமிழ்ப் புத்தாண்டு': { ta: 'தமிழ்ப் புத்தாண்டு', en: 'Tamil New Year' },
  'ஆங்கிலப் புத்தாண்டு': { ta: 'ஆங்கிலப் புத்தாண்டு', en: 'English New Year' },
  'சுபமுகூர்த்த நாட்கள்': { ta: 'சுபமுகூர்த்த நாட்கள்', en: 'Auspicious Days' },

  // Temple / Festival Directory UI
  'புண்ணிய திருத்தலங்கள்': { ta: 'புண்ணிய திருத்தலங்கள்', en: 'Sacred Temples' },
  'ஆலய வரலாற்றுத் தொகுப்பு (Temple Directory)': { ta: 'ஆலய வரலாற்றுத் தொகுப்பு (Temple Directory)', en: 'Temple Directory' },
  'ஆலயங்களின் சிறப்புகள், வரலாறு மற்றும் தரிசன நேரங்கள்': { ta: 'ஆலயங்களின் சிறப்புகள், வரலாறு மற்றும் தரிசன நேரங்கள்', en: 'Temple details, history, and darshan timings' },
  'தற்சமயம் ஆலயங்கள் எதுவும் பதிவிடப்படவில்லை.': { ta: 'தற்சமயம் ஆலயங்கள் எதுவும் பதிவிடப்படவில்லை.', en: 'No temples listed yet.' },
  'நேரம் குறிப்பிடப்படவில்லை': { ta: 'நேரம் குறிப்பிடப்படவில்லை', en: 'Timings not specified' },
  'முழு விபரம் & தல புராணம் வாசிக்க': { ta: 'முழு விபரம் & தல புராணம் வாசிக்க', en: 'Read Temple History & Details' },
  'அமைவிடம்': { ta: 'அமைவிடம்', en: 'Location' },
  'மூலவர்': { ta: 'மூலவர்', en: 'Deity' },
  'நேரம்': { ta: 'தரிசன நேரம்', en: 'Timings' },
  'ஆலயங்கள் பட்டியலுக்கு': { ta: 'ஆலயங்கள் பட்டியலுக்கு', en: 'Back to Temple List' },
  'தகவல் காணப்படவில்லை': { ta: 'தகவல் காணப்படவில்லை', en: 'Information Not Found' },
  'கோரப்பட்ட ஆலயத் தகவல்கள் எதுவும் கிடைக்கவில்லை.': { ta: 'கோரப்பட்ட ஆலயத் தகவல்கள் எதுவும் கிடைக்கவில்லை.', en: 'Requested temple details could not be found.' },
  '← ஆலயங்கள் முகப்புக்குச் செல்லவும்': { ta: '← ஆலயங்கள் முகப்புக்குச் செல்லவும்', en: '← Go back to Temples Home' },
  'தல வரலாறு மற்றும் ஆன்மிக சிறப்புகள் (History & Importance)': { ta: 'தல வரலாறு மற்றும் ஆன்மிக சிறப்புகள் (History & Importance)', en: 'Temple History & Spiritual Significance' },
  'நேரம் விபரங்கள் இல்லை': { ta: 'நேரம் விபரங்கள் இல்லை', en: 'No timing details available' },

  // Festivals UI
  'விரதங்களும் விழாக்களும்': { ta: 'விரதங்களும் விழாக்களும்', en: 'Fasting & Festivals' },
  'முக்கிய திருவிழாக்கள் & மங்கள நாட்கள் (Festivals)': { ta: 'முக்கிய திருவிழாக்கள் & மங்கள நாட்கள் (Festivals)', en: 'Auspicious Festivals & Days' },
  'விரத முறைகள், வழிபாட்டு பலன்கள் மற்றும் பண்டிகை விவரங்கள்': { ta: 'விரத முறைகள், வழிபாட்டு பலன்கள் மற்றும் பண்டிகை விவரங்கள்', en: 'Fasting methods, benefits of worship and festival details' },
  'தற்சமயம் விழாக்கள் எதுவும் பதிவிடப்படவில்லை.': { ta: 'தற்சமயம் விழாக்கள் எதுவும் பதிவிடப்படவில்லை.', en: 'No festivals listed yet.' },
  'முழு விபரம் & பூஜை முறைகள்': { ta: 'முழு விபரம் & பூஜை முறைகள்', en: 'Full Details & Puja Methods' },
  'விழாக்கள் பட்டியலுக்கு': { ta: 'விழாக்கள் பட்டியலுக்கு', en: 'Back to Festivals List' },
  'விரத மற்றும் பூஜை முறைகள் (Rituals & Puja Methods)': { ta: 'விரத மற்றும் பூஜை முறைகள் (Rituals & Puja Methods)', en: 'Fasting and Puja Procedures' },
  'முக்கியத்துவம் & தல புராணம் (Significance)': { ta: 'முக்கியத்துவம் & தல புராணம் (Significance)', en: 'Significance & Mythology' },
  'மங்கள நாள் / விரத நாள்': { ta: 'மங்கள நாள் / விரத நாள்', en: 'Auspicious / Fasting Day' },
  'பண்டிகை விபரங்கள் காணப்படவில்லை': { ta: 'பண்டிகை விபரங்கள் காணப்படவில்லை', en: 'Festival Details Not Found' },
  'கோரப்பட்ட திருவிழா விபரங்கள் எதுவும் கிடைக்கவில்லை.': { ta: 'கோரப்பட்ட திருவிழா விபரங்கள் எதுவும் கிடைக்கவில்லை.', en: 'Requested festival details could not be found.' },
  '← திருவிழாக்கள் முகப்புக்குச் செல்லவும்': { ta: '← திருவிழாக்கள் முகப்புக்குச் செல்லவும்', en: '← Go back to Festivals Home' },

  // Astrology / Spiritual Article UI
  'கோள் நிலைகளும் பரிகாரங்களும்': { ta: 'கோள் நிலைகளும் பரிகாரங்களும்', en: 'Planetary Remedies' },
  'ஜோதிட செய்திகள் & கணிப்புகள் (Astrology News)': { ta: 'ஜோதிட செய்திகள் & கணிப்புகள் (Astrology News)', en: 'Astrology News & Predictions' },
  'வாழ்வை வளமாக்கும் ஜோதிடக் குறிப்புகள்': { ta: 'வாழ்வை வளமாக்கும் ஜோதிடக் குறிப்புகள்', en: 'Astrological guidelines to enrich life' },
  'தற்சமயம் ஜோதிடக் கட்டுரைகள் எதுவும் பதிவிடப்படவில்லை.': { ta: 'தற்சமயம் ஜோதிடக் கட்டுரைகள் எதுவும் பதிவிடப்படவில்லை.', en: 'No astrology articles posted yet.' },
  'முழு விபரம் வாசிக்க': { ta: 'முழு விபரம் வாசிக்க', en: 'Read Full Article' },
  'ஆன்மிக சிந்தனைகள்': { ta: 'ஆன்மிக சிந்தனைகள்', en: 'Spiritual Thoughts' },
  'ஆன்மிக செய்திகள் & கட்டுரைகள் (Spiritual News)': { ta: 'ஆன்மிக செய்திகள் & கட்டுரைகள் (Spiritual News)', en: 'Spiritual News & Articles' },
  'வாழ்வை நல்வழிப்படுத்தும் தெய்வீக கட்டுரைகள்': { ta: 'வாழ்வை நல்வழிப்படுத்தும் தெய்வீக கட்டுரைகள்', en: 'Divine articles to guide life' },
  'தற்சமயம் ஆன்மிக கட்டுரைகள் எதுவும் பதிவிடப்படவில்லை.': { ta: 'தற்சமயம் ஆன்மிக கட்டுரைகள் எதுவும் பதிவிடப்படவில்லை.', en: 'No spiritual articles posted yet.' },

  // News Details UI
  'செய்தி காணப்படவில்லை': { ta: 'செய்தி காணப்படவில்லை', en: 'News Article Not Found' },
  'கோரப்பட்ட செய்தித் தொகுப்பு எதுவும் கிடைக்கவில்லை.': { ta: 'கோரப்பட்ட செய்தித் தொகுப்பு எதுவும் கிடைக்கவில்லை.', en: 'Requested news article could not be found.' },
  '← முகப்புக்குச் செல்லவும்': { ta: '← முகப்புக்குச் செல்லவும்', en: '← Back to Home' },
  'முகப்புப் பக்கத்திற்கு': { ta: 'முகப்புப் பக்கத்திற்கு', en: 'Back to Home Page' },
  'செய்தித் தொகுப்பு': { ta: 'செய்தித் தொகுப்பு', en: 'News Feeds' },
  'பக்தி செய்திகள் (News Feed)': { ta: 'பக்தி செய்திகள் (News Feed)', en: 'Devotional News Feed' },
  'செய்திகள் எதுவும் கிடைக்கவில்லை.': { ta: 'செய்திகள் எதுவும் கிடைக்கவில்லை.', en: 'No news articles found.' },

  // Others UI
  'ஏனைய செய்திகள் & ஆன்மிக தகவல்கள்': { ta: 'ஏனைய செய்திகள் & ஆன்மிக தகவல்கள்', en: 'Other News & Spiritual Info' },
  'பல்வேறு ஆன்மிக தகவல்கள் மற்றும் பொது செய்திகள்': { ta: 'பல்வேறு ஆன்மிக தகவல்கள் மற்றும் பொது செய்திகள்', en: 'Miscellaneous spiritual information and general news' },
  'தற்சமயம் செய்திகள் ஏதுமில்லை.': { ta: 'தற்சமயம் செய்திகள் ஏதுமில்லை.', en: 'No articles in this section yet.' },
  'பொது மற்றும் பொழுதுபோக்கு': { ta: 'பொது மற்றும் பொழுதுபோக்கு', en: 'General & Entertainment' },
  'ஏனைய செய்திகள் (General News)': { ta: 'ஏனைய செய்திகள் (General News)', en: 'Other News (General News)' },
  'விளையாட்டு, சினிமா மற்றும் பொதுவான உலகச் செய்திகள்': { ta: 'விளையாட்டு, சினிமா மற்றும் பொதுவான உலகச் செய்திகள்', en: 'Sports, Cinema and General World News' },
  'தற்சமயம் ஏனைய செய்திகள் எதுவும் பதிவிடப்படவில்லை.': { ta: 'தற்சமயம் ஏனைய செய்திகள் எதுவும் பதிவிடப்படவில்லை.', en: 'No other news articles posted yet.' },

  // Rasis
  'மேஷம்': { ta: 'மேஷம்', en: 'Aries' },
  'ரிஷபம்': { ta: 'ரிஷபம்', en: 'Taurus' },
  'மிதுனம்': { ta: 'மிதுனம்', en: 'Gemini' },
  'கடகம்': { ta: 'கடகம்', en: 'Cancer' },
  'சிம்மம்': { ta: 'சிம்மம்', en: 'Leo' },
  'கன்னி': { ta: 'கன்னி', en: 'Virgo' },
  'துலாம்': { ta: 'துலாம்', en: 'Libra' },
  'விருச்சிகம்': { ta: 'விருச்சிகம்', en: 'Scorpio' },
  'தனுசு': { ta: 'தனுசு', en: 'Sagittarius' },
  'மகரம்': { ta: 'மகரம்', en: 'Capricorn' },
  'கும்பம்': { ta: 'கும்பம்', en: 'Aquarius' },
  'மீனம்': { ta: 'மீனம்', en: 'Pisces' },

  // Rasi Full Names (compatibility page)
  'மேஷம் (Aries)': { ta: 'மேஷம் (Aries)', en: 'Aries' },
  'ரிஷபம் (Taurus)': { ta: 'ரிஷபம் (Taurus)', en: 'Taurus' },
  'மிதுனம் (Gemini)': { ta: 'மிதுனம் (Gemini)', en: 'Gemini' },
  'கடகம் (Cancer)': { ta: 'கடகம் (Cancer)', en: 'Cancer' },
  'சிம்மம் (Leo)': { ta: 'சிம்மம் (Leo)', en: 'Leo' },
  'கன்னி (Virgo)': { ta: 'கன்னி (Virgo)', en: 'Virgo' },
  'துலாம் (Libra)': { ta: 'துலாம் (Libra)', en: 'Libra' },
  'விருச்சிகம் (Scorpio)': { ta: 'விருச்சிகம் (Scorpio)', en: 'Scorpio' },
  'தனுசு (Sagittarius)': { ta: 'தனுசு (Sagittarius)', en: 'Sagittarius' },
  'மகரம் (Capricorn)': { ta: 'மகரம் (Capricorn)', en: 'Capricorn' },
  'கும்பம் (Aquarius)': { ta: 'கும்பம் (Aquarius)', en: 'Aquarius' },
  'மீனம் (Pisces)': { ta: 'மீனம் (Pisces)', en: 'Pisces' },

  // Seeded predictions
  'இன்று உங்களுக்கு சாதகமான நாளாக இருக்கும். தொழில் மற்றும் வியாபாரத்தில் நல்ல லாபம் கிடைக்கும். குடும்பத்தில் மகிழ்ச்சியும் அமைதியும் நிலவும். ஆரோக்கியத்தில் கவனம் தேவை.': {
    ta: 'இன்று உங்களுக்கு சாதகமான நாளாக இருக்கும். தொழில் மற்றும் வியாபாரத்தில் நல்ல லாபம் கிடைக்கும். குடும்பத்தில் மகிழ்ச்சியும் அமைதியும் நிலவும். ஆரோக்கியத்தில் கவனம் தேவை.',
    en: 'Today will be a highly favorable day for you. Good profits will be obtained in business and trade. Happiness and peace will prevail in the family. Attention to health is recommended.'
  },
  'இந்த வாரம் பல புதிய வாய்ப்புகள் தேடி வரும். பொருளாதார நிலை திருப்திகரமாக இருக்கும். நண்பர்களின் உதவி கிடைக்கும். புதிய முயற்சிகளில் வெற்றி பெறுவீர்கள்.': {
    ta: 'இந்த வாரம் பல புதிய வாய்ப்புகள் தேடி வரும். பொருளாதார நிலை திருப்திகரமாக இருக்கும். நண்பர்களின் உதவி கிடைக்கும். புதிய முயற்சிகளில் வெற்றி பெறுவீர்கள்.',
    en: 'This week will bring many new opportunities to your doorstep. The economic situation will remain highly satisfactory. Help from friends will be available. You will succeed in all new endeavors.'
  },
  'இந்த மாதம் உங்களுக்கு ஏற்ற இறக்கங்கள் நிறைந்ததாக இருக்கும். கடின உழைப்பால் மட்டுமே இலக்குகளை அடைய முடியும். தேவையற்ற செலவுகளை தவிர்க்கவும். இறை வழிபாடு நன்மை தரும்.': {
    ta: 'இந்த மாதம் உங்களுக்கு ஏற்ற இறக்கங்கள் நிறைந்ததாக இருக்கும். கடின உழைப்பால் மட்டுமே இலக்குகளை அடைய முடியும். தேவையற்ற செலவுகளை தவிர்க்கவும். இறை வழிபாடு நன்மை தரும்.',
    en: 'This month will be full of ups and downs. Goals can only be achieved through hard work and determination. Avoid unnecessary expenses. Worship of God will bring immense benefits.'
  },
  'குரு பகவானின் பெயர்ச்சி உங்களுக்கு புதிய திருப்பங்களை ஏற்படுத்தும். பணப்புழக்கம் அதிகரிக்கும். குடும்ப சுப காரியங்கள் கைகூடும். உயர் பதவிகள் தேடி வரும்.': {
    ta: 'குரு பகவானின் பெயர்ச்சி உங்களுக்கு புதிய திருப்பங்களை ஏற்படுத்தும். பணப்புழக்கம் அதிகரிக்கும். குடும்ப சுப காரியங்கள் கைகூடும். உயர் பதவிகள் தேடி வரும்.',
    en: 'The transit of Lord Jupiter (Guru) will bring positive new turns. Cash flow will increase. Auspicious family events will materialize. Higher posts and promotions will come your way.'
  },
  'சனி பகவான் பெயர்ச்சியால் சில சவால்களை சந்திக்க நெரிடலாம். எனினும் பொறுமையுடனும் விடாமுயற்சியுடனும் செயல்பட்டால் வெற்றி நிச்சயம். சனிக்கிழமைகளில் எள் தீபம் ஏற்றி வழிபடவும்.': {
    ta: 'சனி பகவான் பெயர்ச்சியால் சில சவால்களை சந்திக்க நெரிடலாம். எனினும் பொறுமையுடனும் விடாமுயற்சியுடனும் செயல்பட்டால் வெற்றி நிச்சயம். சனிக்கிழமைகளில் எள் தீபம் ஏற்றி வழிபடவும்.',
    en: 'Due to Saturn transit (Sani Peyarchi), you may face some challenges. However, if you act with patience and perseverance, success is guaranteed. Light sesame oil lamps on Saturdays.'
  },
  'தமிழ்ப் புத்தாண்டு உங்களுக்கு ஆரோக்கியமும் ஐஸ்வர்யமும் தரும் ஆண்டாக அமையட்டும். தடைபட்ட காரியங்கள் அனைத்தும் விலகும். சுப செய்திகள் வந்து சேரும்.': {
    ta: 'தமிழ்ப் புத்தாண்டு உங்களுக்கு ஆரோக்கியமும் ஐஸ்வர்யமும் தரும் ஆண்டாக அமையட்டும். தடைபட்ட காரியங்கள் அனைத்தும் விலகும். சுப செய்திகள் வந்து சேரும்.',
    en: 'May this Tamil New Year bring you good health, prosperity, and wealth. All obstacles in your work will be cleared. Auspicious news will reach you.'
  },
  'புதிய ஆங்கிலப் புத்தாண்டு பல புதிய சாதனைகளை புரிய வைக்கும். வேலையில் முன்னேற்றம் காண்பீர்கள். புதிய சொத்துக்கள் வாங்கும் யோகம் உண்டாகும்.': {
    ta: 'புதிய ஆங்கிலப் புத்தாண்டு பல புதிய சாதனைகளை புரிய வைக்கும். வேலையில் முன்னேற்றம் காண்பீர்கள். புதிய சொத்துக்கள் வாங்கும் யோகம் உண்டாகும்.',
    en: 'The English New Year will enable you to make many new achievements. You will see progress in your job. Fortunate yogas to buy new properties are created.'
  },

  // Seeded News Articles
  'வைகாசி விசாக பெருவிழா: திருச்செந்தூர் முருகன் கோயிலில் பக்தர்கள் அலைமோதும் கூட்டம்!': {
    ta: 'வைகாசி விசாக பெருவிழா: திருச்செந்தூர் முருகன் கோயிலில் பக்தர்கள் அலைமோதும் கூட்டம்!',
    en: 'Vaikasi Visakam Festival: Thousands of devotees gather at Thiruchendur Murugan Temple!'
  },
  'வைகாசி விசாக திருநாளை முன்னிட்டு அறுபடை வீடுகளில் ஒன்றான திருச்செந்தூர் சுப்பிரமணிய சுவாமி திருக்கோயிலில் ஆயிரக்கணக்கான பக்தர்கள் குவிந்துள்ளனர். இன்று காலை முதலே நீண்ட வரிசையில் நின்று முருகப் பெருமானை தரிசனம் செய்து வருகின்றனர். பக்தர்கள் வசதிக்காக சிறப்பு போக்குவரத்து மற்றும் குடிநீர் வசதிகள் செய்யப்பட்டுள்ளன.': {
    ta: 'வைகாசி விசாக திருநாளை முன்னிட்டு அறுபடை வீடுகளில் ஒன்றான திருச்செந்தூர் சுப்பிரமணிய சுவாமி திருக்கோயிலில் ஆயிரக்கணக்கான பக்தர்கள் குவிந்துள்ளனர். இன்று காலை முதலே நீண்ட வரிசையில் நின்று முருகப் பெருமானை தரிசனம் செய்து வருகின்றனர். பக்தர்கள் வசதிக்காக சிறப்பு போக்குவரத்து மற்றும் குடிநீர் வசதிகள் செய்யப்பட்டுள்ளன.',
    en: 'On the occasion of Vaikasi Visakam, thousands of devotees have gathered at Thiruchendur Subramanya Swamy Temple, one of the six abodes of Lord Murugan. Devotees are standing in long queues to seek blessings of Lord Murugan since early morning. Special transport and drinking water facilities have been arranged.'
  },
  'ஜூன் மாத முக்கிய விரத நாட்கள்: பிரதோஷம், கிருத்திகை மற்றும் சஷ்டி எப்போது?': {
    ta: 'ஜூன் மாத முக்கிய விரத நாட்கள்: பிரதோஷம், கிருத்திகை மற்றும் சஷ்டி எப்போது?',
    en: 'Important Fasting Days of June: When are Pradosham, Krithigai and Sashti?'
  },
  'நடப்பு ஜூன் மாதத்தில் வரவிருக்கும் ஆன்மிக விரத நாட்களின் பட்டியல் இதோ. பிரதோஷம், கிருத்திகை, அமாவாசை மற்றும் சஷ்டி ஆகிய முக்கிய நாட்களில் செய்ய வேண்டிய வழிபாட்டு முறைகள் மற்றும் அதன் பலன்கள் குறித்து விரிவாக இந்த தொகுப்பில் காணலாம்.': {
    ta: 'நடப்பு ஜூன் மாதத்தில் வரவிருக்கும் ஆன்மிக விரத நாட்களின் பட்டியல் இதோ. பிரதோஷம், கிருத்திகை, அமாவாசை மற்றும் சஷ்டி ஆகிய முக்கிய நாட்களில் செய்ய வேண்டிய வழிபாட்டு முறைகள் மற்றும் அதன் பலன்கள் குறித்து விரிவாக இந்த தொகுப்பில் காணலாம்.',
    en: 'Here is the list of upcoming spiritual fasting days in June. Learn in detail about the worship rituals and benefits to be performed on main days like Pradosham, Krithigai, Amavasai, and Sashti.'
  },
  'மதுரை மீனாட்சி அம்மன் கோவிலில் ஜூன் 10 முதல் கோடை திருவிழா தொடக்கம்': {
    ta: 'மதுரை மீனாட்சி அம்மன் கோவிலில் ஜூன் 10 முதல் கோடை திருவிழா தொடக்கம்',
    en: 'Summer Festival Starts at Madurai Meenakshi Temple from June 10'
  },
  'உலக புகழ்பெற்ற மதுரை மீனாட்சி சுந்தரேஸ்வரர் திருக்கோவிலில் இந்த ஆண்டுக்கான கோடை வசந்த திருவிழா ஜூன் 10 ஆம் தேதி கொடியேற்றத்துடன் தொடங்குகிறது. 10 நாட்கள் நடைபெறும் இத்திருவிழாவில் தினமும் மீனாட்சி அம்மனும் சுந்தரேஸ்வரரும் பல்வேறு வாகனங்களில் எழுந்தருளி வீதி உலா வருவர்.': {
    ta: 'உலக புகழ்பெற்ற மதுரை மீனாட்சி சுந்தரேஸ்வரர் திருக்கோவிலில் இந்த ஆண்டுக்கான கோடை வசந்த திருவிழா ஜூன் 10 ஆம் தேதி கொடியேற்றத்துடன் தொடங்குகிறது. 10 நாட்கள் நடைபெறும் இத்திருவிழாவில் தினமும் மீனாட்சி அம்மனும் சுந்தரேஸ்வரரும் பல்வேறு வாகனங்களில் எழுந்தருளி வீதி உலா வருவர்.',
    en: 'The annual Summer Vasanda Festival of the world-famous Madurai Meenakshi Sundareswarar Temple starts with flag hoisting on June 10. During the 10-day festival, Meenakshi Amman and Lord Sundareswarar will progress in street processions daily on different mounts.'
  },
  'குரு பெயர்ச்சி பலன்கள் 2026: இந்த 5 ராசிகளுக்கு அதிர்ஷ்ட மழை பொழியும்!': {
    ta: 'குரு பெயர்ச்சி பலன்கள் 2026: இந்த 5 ராசிகளுக்கு அதிர்ஷ்ட மழை பொழியும்!',
    en: 'Guru Peyarchi Predictions 2026: Fortunes Rain Down on these 5 Zodiac signs!'
  },
  '2026 ஆம் ஆண்டு நிகழும் குரு பெயர்ச்சியால் எந்தெந்த ராசிகளுக்கு அபரிமிதமான நற்பலன்கள் கிடைக்கப் போகிறது என்பதை ஜோதிட வல்லுநர்கள் கணித்துள்ளனர். குறிப்பாக ரிஷபம், சிம்மம், விருச்சிக ராசியினருக்குப் புதிய தொழில் வாய்ப்புகள் மற்றும் பண வரவுகள் அதிகரிக்கும் எனத் தெரிகிறது.': {
    ta: '2026 ஆம் ஆண்டு நிகழும் குரு பெயர்ச்சியால் எந்தெந்த ராசிகளுக்கு அபரிமிதமான நற்பலன்கள் கிடைக்கப் போகிறது என்பதை ஜோதிட வல்லுநர்கள் கணித்துள்ளனர். குறிப்பாக ரிஷபம், சிம்மம், விருச்சிக ராசியினருக்குப் புதிய தொழில் வாய்ப்புகள் மற்றும் பண வரவுகள் அதிகரிக்கும் எனத் தெரிகிறது.',
    en: 'Astrologers have predicted which zodiac signs will receive abundant positive results from the 2026 Guru Peyarchi. In particular, Taurus, Leo, and Scorpio individuals are set to see an increase in new business opportunities and monetary inflows.'
  },
  'தமிழகத்தின் புகழ்பெற்ற ஆன்மிக திருத்தலங்களின் வரலாறும் சிறப்புகளும்': {
    ta: 'தமிழகத்தின் புகழ்பெற்ற ஆன்மிக திருத்தலங்களின் வரலாறும் சிறப்புகளும்',
    en: 'History and Specialties of Famous Spiritual Holy Abodes of Tamil Nadu'
  },
  'தமிழ்நாடு ஆன்மிக பூமியாக திகழ்கிறது. இங்குள்ள பழமையான மற்றும் வரலாற்று சிறப்புமிக்க கோவில்களின் கட்டிடக்கலை மற்றும் புராண வரலாறுகள் நம்மை வியக்க வைக்கின்றன. இந்த வாரம் தஞ்சை பெரிய கோவில் மற்றும் ஸ்ரீரங்கம் ரங்கநாதர் கோவிலின் அறியப்படாத தகவல்களை காண்போம்.': {
    ta: 'தமிழ்நாடு ஆன்மிக பூமியாக திகழ்கிறது. இங்குள்ள பழமையான மற்றும் வரலாற்று சிறப்புமிக்க கோவில்களின் கட்டிடக்கலை மற்றும் புராண வரலாறுகள் நம்மை வியக்க வைக்கின்றன. இந்த வாரம் தஞ்சை பெரிய கோவில் மற்றும் ஸ்ரீரங்கம் ரங்கநாதர் கோவிலின் அறியப்படாத தகவல்களை காண்போம்.',
    en: 'Tamil Nadu is a spiritual land. The architecture and mythological histories of its ancient, historical temples are mind-blowing. This week we explore lesser-known facts about Thanjavur Big Temple and Srirangam Ranganathar Temple.'
  },

  // Seeded Temples
  'தஞ்சாவூர் பெருவுடையார் கோவில்': { ta: 'தஞ்சாவூர் பெருவுடையார் கோவில்', en: 'Thanjavur Brihadeeswarar Temple' },
  'தஞ்சாவூர், தமிழ்நாடு': { ta: 'தஞ்சாவூர், தமிழ்நாடு', en: 'Thanjavur, Tamil Nadu' },
  'பிரகதீஸ்வரர் (சிவன்)': { ta: 'பிரகதீஸ்வரர் (சிவன்)', en: 'Brihadeeswarar (Lord Shiva)' },
  'ராஜராஜ சோழனால் கட்டப்பட்ட ஆயிரம் ஆண்டுகள் பழமையான சோழர் கால கட்டிடக்கலை அற்புதம். இக்கோவிலின் விமானத்தின் நிழல் தரையில் விழுவதில்லை என்ற புராண பெருமை கொண்டது.': {
    ta: 'ராஜராஜ சோழனால் கட்டப்பட்ட ஆயிரம் ஆண்டுகள் பழமையான சோழர் கால கட்டிடக்கலை அற்புதம். இக்கோவிலின் விமானத்தின் நிழல் தரையில் விழுவதில்லை என்ற புராண பெருமை கொண்டது.',
    en: 'A thousand-year-old architectural marvel built by Raja Raja Chola I. The temple is famous for the architectural highlight that the shadow of its main tower does not fall on the ground at noon.'
  },
  'காலை 6.00 மணி முதல் மதியம் 12.30 மணி வரை, மாலை 4.00 மணி முதல் இரவு 8.30 மணி வரை': {
    ta: 'காலை 6.00 மணி முதல் மதியம் 12.30 மணி வரை, மாலை 4.00 மணி முதல் இரவு 8.30 மணி வரை',
    en: '6:00 AM to 12:30 PM, 4:00 PM to 8:30 PM'
  },
  'மதுரை மீனாட்சி சுந்தரேஸ்வரர் கோவில்': { ta: 'மதுரை மீனாட்சி சுந்தரேஸ்வரர் கோவில்', en: 'Madurai Meenakshi Sundareswarar Temple' },
  'மதுரை, தமிழ்நாடு': { ta: 'மதுரை, தமிழ்நாடு', en: 'Madurai, Tamil Nadu' },
  'மீனாட்சி அம்மன், சுந்தரேஸ்வரர்': { ta: 'மீனாட்சி அம்மன், சுந்தரேஸ்வரர்', en: 'Meenakshi Amman & Lord Sundareswarar' },
  'பாண்டிய மன்னர்களால் கட்டப்பட்ட கலைநயமிக்க சிற்பங்களைக் கொண்ட கோவில். இதன் பொற்றாமரைக்குளமும் ஆயிரம் கால் மண்டபமும் மிகவும் புகழ்பெற்றவை.': {
    ta: 'பாண்டிய மன்னர்களால் கட்டப்பட்ட கலைநயமிக்க சிற்பங்களைக் கொண்ட கோவில். இதன் பொற்றாமரைக்குளமும் ஆயிரம் கால் மண்டபமும் மிகவும் புகழ்பெற்றவை.',
    en: 'An ancient temple built by the Pandya kings with highly artistic sculptures. Its Golden Lotus Pond and Thousand Pillar Hall are extremely famous.'
  },
  'காலை 5.00 மணி முதல் மதியம் 12.30 மணி வரை, மாலை 4.00/ இரவு 9.30 மணி வரை': {
    ta: 'காலை 5.00 மணி முதல் மதியம் 12.30 மணி வரை, மாலை 4.00/ இரவு 9.30 மணி வரை',
    en: '5:00 AM to 12:30 PM, 4:00 PM to 9:30 PM'
  },

  // Seeded Festivals
  'மகா சிவராத்திரி': { ta: 'மகா சிவராத்திரி', en: 'Maha Shivaratri' },
  'மாசி மாதம் (பிப்ரவரி/மார்ச்)': { ta: 'மாசி மாதம் (பிப்ரவரி/மார்ச்)', en: 'Masi Month (February/March)' },
  'சிவபெருமானுக்கு அர்ப்பணிக்கப்பட்ட உன்னதமான விரத நாள். இந்நாளில் இரவெல்லாம் விழித்திருந்து நான்கு கால பூசைகளில் சிவபெருமானை வழிபட்டால் சகல பாவங்களும் நீங்கும்.': {
    ta: 'சிவபெருமானுக்கு அர்ப்பணிக்கப்பட்ட உன்னதமான விரத நாள். இந்நாளில் இரவெல்லாம் விழித்திருந்து நான்கு கால பூசைகளில் சிவபெருமானை வழிபட்டால் சகல பாவங்களும் நீங்கும்.',
    en: 'A highly auspicious fasting day dedicated to Lord Shiva. Staying awake all night worshipping Lord Shiva in the four-time prayers cleanses all sins.'
  },
  'சிவ அர்ச்சனை, ருத்ர பாராயணம், இரவு முழுவதும் விழித்திருத்தல், உபவாசம்.': {
    ta: 'சிவ அர்ச்சனை, ருத்ர பாராயணம், இரவு முழுவதும் விழித்திருத்தல், உபவாசம்.',
    en: 'Shiva Archana, Rudra Parayanam, staying awake all night, fasting.'
  },
  'தைப்பொங்கல் பெருவிழா': { ta: 'தைப்பொங்கல் பெருவிழா', en: 'Thai Pongal Harvest Festival' },
  'தை 1 (ஜனவரி 14/15)': { ta: 'தை 1 (ஜனவரி 14/15)', en: 'Thai 1 (January 14/15)' },
  'இயற்கைக்கும் சூரியனுக்கும் உழவர் பெருமக்கள் நன்றி செலுத்தும் அறுவடைத் திருநாள். புதுப் பானையில் பொங்கலிட்டு மங்களகரமாகக் கொண்டாடப்படுகிறது.': {
    ta: 'இயற்கைக்கும் சூரியனுக்கும் உழவர் பெருமக்கள் நன்றி செலுத்தும் அறுவடைத் திருநாள். புதுப் பானையில் பொங்கலிட்டு மங்களகரமாகக் கொண்டாடப்படுகிறது.',
    en: 'A harvest festival where farmers show gratitude to nature and the Sun. Celebrated auspiciously by cooking pongal in new pots.'
  },
  'சூரிய நமஸ்காரம், புது பானையில் பொங்கலிடுதல், மாட்டுப் பொங்கல் வழிபாடு.': {
    ta: 'சூரிய நமஸ்காரம், புது பானையில் பொங்கலிடுதல், மாட்டுப் பொங்கல் வழிபாடு.',
    en: 'Surya Namaskar, cooking pongal in new pots, Maattu Pongal worship.'
  },

  // Seeded Astrologers
  'ஜோதிட ரத்னா ராமலிங்கம்': { ta: 'ஜோதிட ரத்னா ராமலிங்கம்', en: 'Jyothida Rathna Ramalingam' },
  'வேத ஜோதிடம் & ஜாதகம் கணித்தல்': { ta: 'வேத ஜோதிடம் & ஜாதகம் கணித்தல்', en: 'Vedic Astrology & Horoscope Casting' },
  'சுவாமி பிரகாஷானந்தா': { ta: 'சுவாமி பிரகாஷானந்தா', en: 'Swami Prakashananda' },
  'பிரசன்ன ஜோதிடம் & வாஸ்து சாஸ்திரம்': { ta: 'பிரசன்ன ஜோதிடம் & வாஸ்து சாஸ்திரம்', en: 'Prasanna Astrology & Vastu Shastra' },
  'ஜோதிட சிரோமணி மீனாட்சி': { ta: 'ஜோதிட சிரோமணி மீனாட்சி', en: 'Jyothida Shiromani Meenatchi' },
  'எண் கணிதம் (Numerology) & கைரேகை நிபுணர்': { ta: 'எண் கணிதம் (Numerology) & கைரேகை நிபுணர்', en: 'Numerology & Palmistry Specialist' },

  // Seeded Devotional Video Titles & Descriptions
  'கந்த சஷ்டி கவசம் | கந்தன் புகழ்பாடும் பக்திப் பாடல்கள்': {
    ta: 'கந்த சஷ்டி கவசம் | கந்தன் புகழ்பாடும் பக்திப் பாடல்கள்',
    en: 'Kanda Sashti Kavasam | Devotional Songs Praising Lord Murugan'
  },
  'தினமும் கேட்க வேண்டிய முருகனின் பக்திப் பாடல்கள் மற்றும் கந்த சஷ்டி கவசம்.': {
    ta: 'தினமும் கேட்க வேண்டிய முருகனின் பக்திப் பாடல்கள் மற்றும் கந்த சஷ்டி கவசம்.',
    en: 'Daily devotional hymns of Lord Murugan and Kanda Sashti Kavasam.'
  },
  'மகா மிருத்யுஞ்ஜய மந்திரம் | 108 முறை ஜெபம்': {
    ta: 'மகா மிருத்யுஞ்ஜய மந்திரம் | 108 முறை ஜெபம்',
    en: 'Maha Mrityunjaya Mantra | 108 Times Chanting'
  },
  'ஆரோக்கியமும் நீண்ட ஆயுளும் தரும் சிவபெருமானின் மகா மிருத்யுஞ்ஜய மந்திரம்.': {
    ta: 'ஆரோக்கியமும் நீண்ட ஆயுளும் தரும் சிவபெருமானின் மகா மிருத்யுஞ்ஜய மந்திரம்.',
    en: 'Maha Mrityunjaya Mantra of Lord Shiva for health and longevity.'
  },
  'விஷ்ணு சஹஸ்ரநாமம் | மன அமைதி தரும் ஸ்லோகம்': {
    ta: 'விஷ்ணு சஹஸ்ரநாமம் | மன அமைதி தரும் ஸ்லோகம்',
    en: 'Vishnu Sahasranamam | Sloka for Peace of Mind'
  },
  'ஸ்ரீ விஷ்ணு சஹஸ்ரநாம ஸ்தோத்திரம் வரிகளுடன் பக்திப் பெருக்குடன்.': {
    ta: 'ஸ்ரீ விஷ்ணு சஹஸ்ரநாம ஸ்தோத்திரம் வரிகளுடன் பக்திப் பெருக்குடன்.',
    en: 'Sri Vishnu Sahasranama Stotram with lyrics in deep devotion.'
  },
  'லலிதா சஹஸ்ரநாமம் | அன்னை அம்பிகையின் அருள் பெற': {
    ta: 'லலிதா சஹஸ்ரநாமம் | அன்னை அம்பிகையின் அருள் பெற',
    en: 'Lalitha Sahasranamam | To Receive Blessings of Goddess Lalitha'
  },
  'அம்பாளின் அருளை முழுமையாகப் பெற தினமும் லலிதா சஹஸ்ரநாமம் கேட்கலாம்.': {
    ta: 'அம்பாளின் அருளை முழுமையாகப் பெற தினமும் லலிதா சஹஸ்ரநாமம் கேட்கலாம்.',
    en: 'Listen to Lalitha Sahasranamam daily to fully receive Goddess blessings.'
  },
  'ஸ்ரீ வெங்கடேச சுப்ரபாதம் | காலை நேர பக்திப் பாடல்': {
    ta: 'ஸ்ரீ வெங்கடேச சுப்ரபாதம் | காலை நேர பக்திப் பாடல்',
    en: 'Sri Venkateswara Suprabhatam | Morning Devotional Song'
  },
  'காலை நேரத்தை தெய்வீகமாகத் தொடங்க திருப்பதி வெங்கடாசலபதியின் சுப்ரபாதம்.': {
    ta: 'காலை நேரத்தை தெய்வீகமாகத் தொடங்க திருப்பதி வெங்கடாசலபதியின் சுப்ரபாதம்.',
    en: 'Tirupati Venkateswara Suprabhatam to start your morning divinely.'
  },
  'ஹனுமான் சாலிசா | துன்பங்கள் போக்கும் ராம தூதன்': {
    ta: 'ஹனுமான் சாலிசா | துன்பங்கள் போக்கும் ராம தூதன்',
    en: 'Hanuman Chalisa | Remover of Troubles, Messenger of Rama'
  },
  'பயம் மற்றும் தடைகள் நீங்கி வெற்றி பெற ஹனுமான் சாலிசா பாடல் கேட்கலாம்.': {
    ta: 'பயம் மற்றும் தடைகள் நீங்கி வெற்றி பெற ஹனுமான் சாலிசா பாடல் கேட்கலாம்.',
    en: 'Listen to Hanuman Chalisa to eliminate fears and barriers, achieving success.'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ta');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved === 'ta' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    if (!key) return '';
    const trimmed = key.trim();
    if (translations[trimmed] && translations[trimmed][language]) {
      return translations[trimmed][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
