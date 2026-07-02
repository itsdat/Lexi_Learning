export interface FlashcardTopic {
  id: string;
  name: string;
  vietnameseName: string;
  emoji: string;
  category: string;
  description?: string;
}

export const FLASHCARD_TOPICS: FlashcardTopic[] = [
  // Basic & Everyday
  { id: "greetings", name: "Greetings & Politeness", vietnameseName: "Lời chào hỏi & Lịch sự", emoji: "👋", category: "Basic" },
  { id: "introductions", name: "Introductions", vietnameseName: "Giới thiệu bản thân", emoji: "🤝", category: "Basic" },
  { id: "daily-routines", name: "Daily Routines", vietnameseName: "Thói quen hàng ngày", emoji: "⏰", category: "Basic" },
  { id: "numbers-dates", name: "Numbers & Dates", vietnameseName: "Số & Ngày tháng", emoji: "🔢", category: "Basic" },
  { id: "days-months", name: "Days & Months", vietnameseName: "Ngày & Tháng", emoji: "📅", category: "Basic" },
  { id: "time-hours", name: "Time & Hours", vietnameseName: "Thời gian & Giờ", emoji: "⏱️", category: "Basic" },
  { id: "colors", name: "Colors", vietnameseName: "Màu sắc", emoji: "🎨", category: "Basic" },
  { id: "shapes", name: "Shapes", vietnameseName: "Hình dạng", emoji: "⬜", category: "Basic" },
  { id: "family-members", name: "Family Members", vietnameseName: "Các thành viên gia đình", emoji: "👨‍👩‍👧‍👦", category: "Basic" },
  { id: "relationships", name: "Relationships", vietnameseName: "Mối quan hệ", emoji: "💑", category: "Basic" },
  { id: "body-parts", name: "Body Parts", vietnameseName: "Các bộ phận cơ thể", emoji: "🦾", category: "Basic" },
  { id: "appearance", name: "Appearance", vietnameseName: "Ngoại hình", emoji: "👀", category: "Basic" },
  { id: "personality", name: "Personality", vietnameseName: "Tính cách", emoji: "😊", category: "Basic" },
  { id: "emotions", name: "Emotions & Feelings", vietnameseName: "Cảm xúc & Tình cảm", emoji: "😭", category: "Basic" },
  { id: "hygiene", name: "Personal Hygiene", vietnameseName: "Vệ sinh cá nhân", emoji: "🧼", category: "Basic" },
  { id: "sleep", name: "Sleep & Rest", vietnameseName: "Ngủ & Nghỉ ngơi", emoji: "😴", category: "Basic" },

  // Food & Dining
  { id: "fruits-vegetables", name: "Fruits & Vegetables", vietnameseName: "Trái cây & Rau xanh", emoji: "🍎", category: "Food" },
  { id: "meat-seafood", name: "Meat & Seafood", vietnameseName: "Thịt & Hải sản", emoji: "🍖", category: "Food" },
  { id: "beverages", name: "Beverages", vietnameseName: "Đồ uống", emoji: "☕", category: "Food" },
  { id: "breakfast", name: "Breakfast Foods", vietnameseName: "Đồ ăn sáng", emoji: "🥐", category: "Food" },
  { id: "fast-food", name: "Fast Food", vietnameseName: "Thức ăn nhanh", emoji: "🍔", category: "Food" },
  { id: "snacks", name: "Snacks", vietnameseName: "Đồ ăn nhẹ", emoji: "🍿", category: "Food" },
  { id: "desserts", name: "Desserts & Sweets", vietnameseName: "Tráng miệng & Đồ ngọt", emoji: "🍰", category: "Food" },
  { id: "cooking", name: "Cooking & Kitchen", vietnameseName: "Nấu ăn & Bếp", emoji: "👨‍🍳", category: "Food" },
  { id: "utensils", name: "Kitchen Utensils", vietnameseName: "Dụng cụ nhà bếp", emoji: "🔪", category: "Food" },
  { id: "spices", name: "Spices & Seasonings", vietnameseName: "Gia vị & Các chất điều vị", emoji: "🌶️", category: "Food" },
  { id: "baking", name: "Baking", vietnameseName: "Nướng bánh", emoji: "🧁", category: "Food" },
  { id: "restaurant", name: "Restaurant & Dining", vietnameseName: "Nhà hàng & Ăn uống", emoji: "🍽️", category: "Food" },

  // Home & Living
  { id: "rooms", name: "Rooms in a House", vietnameseName: "Các phòng trong nhà", emoji: "🏠", category: "Home" },
  { id: "furniture", name: "Furniture & Decor", vietnameseName: "Nội thất & Trang trí", emoji: "🛋️", category: "Home" },
  { id: "appliances", name: "Kitchen Appliances", vietnameseName: "Thiết bị nhà bếp", emoji: "🧊", category: "Home" },
  { id: "household", name: "Household Items", vietnameseName: "Đồ dùng gia đình", emoji: "🧹", category: "Home" },
  { id: "cleaning", name: "Cleaning & Housework", vietnameseName: "Dọn dẹp & Việc nhà", emoji: "🧽", category: "Home" },
  { id: "tools", name: "Tools & Equipment", vietnameseName: "Dụng cụ & Thiết bị", emoji: "🔧", category: "Home" },
  { id: "repairs", name: "Home Repairs", vietnameseName: "Sửa chữa nhà", emoji: "🔨", category: "Home" },

  // Clothing & Fashion
  { id: "clothes", name: "Clothes & Apparel", vietnameseName: "Quần áo & Trang phục", emoji: "👕", category: "Fashion" },
  { id: "shoes", name: "Shoes & Footwear", vietnameseName: "Giày & Đồ đi chân", emoji: "👞", category: "Fashion" },
  { id: "accessories", name: "Accessories", vietnameseName: "Phụ kiện", emoji: "👒", category: "Fashion" },
  { id: "fabrics", name: "Fabrics & Materials", vietnameseName: "Vải & Chất liệu", emoji: "🧵", category: "Fashion" },
  { id: "fashion", name: "Fashion & Style", vietnameseName: "Thời trang & Phong cách", emoji: "💃", category: "Fashion" },
  { id: "jewelry", name: "Jewelry", vietnameseName: "Trang sức", emoji: "💎", category: "Fashion" },

  // Travel & Transportation
  { id: "vehicles", name: "Vehicles & Cars", vietnameseName: "Phương tiện & Ô tô", emoji: "🚗", category: "Travel" },
  { id: "motorcycles", name: "Motorcycles & Bicycles", vietnameseName: "Xe máy & Xe đạp", emoji: "🏍️", category: "Travel" },
  { id: "public-transport", name: "Public Transportation", vietnameseName: "Phương tiện công cộng", emoji: "🚌", category: "Travel" },
  { id: "train-bus", name: "Train & Bus", vietnameseName: "Tàu & Xe buýt", emoji: "🚂", category: "Travel" },
  { id: "airport", name: "Airport & Flying", vietnameseName: "Sân bay & Bay", emoji: "✈️", category: "Travel" },
  { id: "hotels", name: "Hotels & Accommodation", vietnameseName: "Khách sạn & Nơi ở", emoji: "🏨", category: "Travel" },
  { id: "attractions", name: "Tourist Attractions", vietnameseName: "Địa điểm du lịch", emoji: "🗼", category: "Travel" },
  { id: "directions", name: "Directions & Navigation", vietnameseName: "Hướng dẫn & Điều hướng", emoji: "🧭", category: "Travel" },
  { id: "road-signs", name: "Road Signs", vietnameseName: "Biển báo đường", emoji: "🛑", category: "Travel" },
  { id: "traffic", name: "Traffic", vietnameseName: "Giao thông", emoji: "🚦", category: "Travel" },
  { id: "driving", name: "Driving", vietnameseName: "Lái xe", emoji: "🚙", category: "Travel" },

  // Shopping & Money
  { id: "shops", name: "Shops & Stores", vietnameseName: "Cửa hàng", emoji: "🏬", category: "Shopping" },
  { id: "online-shopping", name: "Online Shopping", vietnameseName: "Mua sắm trực tuyến", emoji: "💳", category: "Shopping" },
  { id: "shopping-items", name: "Shopping Items", vietnameseName: "Mặt hàng mua sắm", emoji: "🛍️", category: "Shopping" },
  { id: "electronics", name: "Electronics", vietnameseName: "Điện tử", emoji: "📱", category: "Shopping" },
  { id: "money", name: "Money & Currency", vietnameseName: "Tiền & Tiền tệ", emoji: "💵", category: "Shopping" },
  { id: "payment", name: "Payment Methods", vietnameseName: "Phương thức thanh toán", emoji: "💰", category: "Shopping" },
  { id: "prices", name: "Prices & Bargaining", vietnameseName: "Giá & Thương lượng", emoji: "🏷️", category: "Shopping" },
  { id: "banking", name: "Banking", vietnameseName: "Ngân hàng", emoji: "🏦", category: "Shopping" },
  { id: "gifts", name: "Gifts", vietnameseName: "Quà tặng", emoji: "🎁", category: "Shopping" },

  // Health & Medical
  { id: "medical-profs", name: "Medical Professions", vietnameseName: "Các ngành y tế", emoji: "👨‍⚕️", category: "Health" },
  { id: "diseases", name: "Diseases & Symptoms", vietnameseName: "Bệnh & Triệu chứng", emoji: "🤒", category: "Health" },
  { id: "medicines", name: "Medicines & Treatment", vietnameseName: "Thuốc & Điều trị", emoji: "💊", category: "Health" },
  { id: "hospital", name: "Hospital & Clinic", vietnameseName: "Bệnh viện & Phòng khám", emoji: "🏥", category: "Health" },
  { id: "first-aid", name: "First Aid", vietnameseName: "Sơ cứu", emoji: "🩹", category: "Health" },
  { id: "nutrition", name: "Nutrition", vietnameseName: "Dinh dưỡng", emoji: "🥗", category: "Health" },
  { id: "lifestyle", name: "Healthy Lifestyle", vietnameseName: "Lối sống lành mạnh", emoji: "🏃", category: "Health" },
  { id: "mental-health", name: "Mental Health", vietnameseName: "Sức khỏe tâm thần", emoji: "🧠", category: "Health" },
  { id: "fitness", name: "Fitness & Exercise", vietnameseName: "Thể dục & Tập luyện", emoji: "💪", category: "Health" },

  // School & Education
  { id: "subjects", name: "School Subjects", vietnameseName: "Các môn học", emoji: "📚", category: "Education" },
  { id: "learning", name: "Learning & Studying", vietnameseName: "Học tập", emoji: "📖", category: "Education" },
  { id: "supplies", name: "School Supplies", vietnameseName: "Dụng cụ học tập", emoji: "✏️", category: "Education" },
  { id: "classroom", name: "Classroom English", vietnameseName: "Tiếng Anh lớp học", emoji: "🎓", category: "Education" },
  { id: "exams", name: "Exams & Tests", vietnameseName: "Kỳ thi & Bài kiểm tra", emoji: "📝", category: "Education" },
  { id: "study-skills", name: "Study Skills", vietnameseName: "Kỹ năng học tập", emoji: "🎯", category: "Education" },
  { id: "university", name: "University Life", vietnameseName: "Đời sống đại học", emoji: "🏫", category: "Education" },
  { id: "reading", name: "Books & Reading", vietnameseName: "Sách & Đọc sách", emoji: "📕", category: "Education" },

  // Work & Career
  { id: "jobs", name: "Job Titles & Professions", vietnameseName: "Chức danh & Nghề nghiệp", emoji: "💼", category: "Work" },
  { id: "office", name: "Office Equipment", vietnameseName: "Thiết bị văn phòng", emoji: "🖥️", category: "Work" },
  { id: "business", name: "Business & Company", vietnameseName: "Kinh doanh & Công ty", emoji: "🏢", category: "Work" },
  { id: "meetings", name: "Meetings", vietnameseName: "Cuộc họp", emoji: "🤵", category: "Work" },
  { id: "marketing", name: "Marketing", vietnameseName: "Tiếp thị", emoji: "📢", category: "Work" },
  { id: "finance", name: "Finance", vietnameseName: "Tài chính", emoji: "📊", category: "Work" },
  { id: "sales", name: "Sales", vietnameseName: "Bán hàng", emoji: "🤝", category: "Work" },
  { id: "customer-service", name: "Customer Service", vietnameseName: "Dịch vụ khách hàng", emoji: "📞", category: "Work" },
  { id: "interviews", name: "Interviews & Recruitment", vietnameseName: "Phỏng vấn & Tuyển dụng", emoji: "👔", category: "Work" },
  { id: "skills", name: "Skills & Abilities", vietnameseName: "Kỹ năng & Khả năng", emoji: "⭐", category: "Work" },

  // Nature & Environment
  { id: "animals", name: "Animals & Pets", vietnameseName: "Động vật & Thú cưng", emoji: "🐶", category: "Nature" },
  { id: "birds", name: "Birds & Insects", vietnameseName: "Chim & Côn trùng", emoji: "🦋", category: "Nature" },
  { id: "sea-animals", name: "Sea Animals", vietnameseName: "Động vật biển", emoji: "🐠", category: "Nature" },
  { id: "plants", name: "Plants & Flowers", vietnameseName: "Cây cối & Hoa", emoji: "🌸", category: "Nature" },
  { id: "trees", name: "Trees", vietnameseName: "Cây", emoji: "🌳", category: "Nature" },
  { id: "water", name: "Mountains & Water", vietnameseName: "Núi & Nước", emoji: "⛰️", category: "Nature" },
  { id: "weather", name: "Weather & Climate", vietnameseName: "Thời tiết & Khí hậu", emoji: "🌤️", category: "Nature" },
  { id: "seasons", name: "Seasons", vietnameseName: "Các mùa", emoji: "🍂", category: "Nature" },
  { id: "disasters", name: "Natural Disasters", vietnameseName: "Thảm họa thiên nhiên", emoji: "🌊", category: "Nature" },
  { id: "environment", name: "Environmental Issues", vietnameseName: "Vấn đề môi trường", emoji: "♻️", category: "Nature" },

  // Sports & Leisure
  { id: "sports", name: "Sports & Games", vietnameseName: "Thể thao & Trò chơi", emoji: "⚽", category: "Leisure" },
  { id: "olympic", name: "Olympic Sports", vietnameseName: "Thể thao Olympic", emoji: "🥇", category: "Leisure" },
  { id: "outdoor", name: "Outdoor Activities", vietnameseName: "Hoạt động ngoài trời", emoji: "🏕️", category: "Leisure" },
  { id: "gym", name: "Gym Equipment", vietnameseName: "Thiết bị tập gym", emoji: "🏋️", category: "Leisure" },
  { id: "hobbies", name: "Hobbies & Entertainment", vietnameseName: "Sở thích & Giải trí", emoji: "🎮", category: "Leisure" },
  { id: "music", name: "Music & Instruments", vietnameseName: "Âm nhạc & Nhạc cụ", emoji: "🎸", category: "Leisure" },
  { id: "movies", name: "Movies & TV", vietnameseName: "Phim & TV", emoji: "🎬", category: "Leisure" },
  { id: "photography", name: "Photography", vietnameseName: "Nhiếp ảnh", emoji: "📷", category: "Leisure" },
  { id: "gaming", name: "Video Games", vietnameseName: "Trò chơi video", emoji: "🎯", category: "Leisure" },
  { id: "art", name: "Art & Drawing", vietnameseName: "Nghệ thuật & Vẽ tranh", emoji: "🎨", category: "Leisure" },

  // Technology & Internet
  { id: "computers", name: "Computers & Hardware", vietnameseName: "Máy tính & Phần cứng", emoji: "💻", category: "Tech" },
  { id: "internet", name: "Internet & Website", vietnameseName: "Internet & Website", emoji: "🌐", category: "Tech" },
  { id: "mobile", name: "Mobile & Apps", vietnameseName: "Di động & Ứng dụng", emoji: "📱", category: "Tech" },
  { id: "programming", name: "Software & Programming", vietnameseName: "Phần mềm & Lập trình", emoji: "💾", category: "Tech" },
  { id: "databases", name: "Databases", vietnameseName: "Cơ sở dữ liệu", emoji: "🗄️", category: "Tech" },
  { id: "cloud", name: "Cloud Computing", vietnameseName: "Điện toán đám mây", emoji: "☁️", category: "Tech" },
  { id: "cybersecurity", name: "Cybersecurity", vietnameseName: "An ninh mạng", emoji: "🔐", category: "Tech" },
  { id: "ai", name: "Artificial Intelligence", vietnameseName: "Trí tuệ nhân tạo", emoji: "🤖", category: "Tech" },
  { id: "social-media", name: "Social Media", vietnameseName: "Mạng xã hội", emoji: "📲", category: "Tech" },

  // Holidays & Celebrations
  { id: "birthday", name: "Birthday", vietnameseName: "Sinh nhật", emoji: "🎂", category: "Holidays" },
  { id: "christmas", name: "Christmas", vietnameseName: "Giáng sinh", emoji: "🎄", category: "Holidays" },
  { id: "new-year", name: "New Year", vietnameseName: "Năm mới", emoji: "🎆", category: "Holidays" },
  { id: "halloween", name: "Halloween", vietnameseName: "Halloween", emoji: "👻", category: "Holidays" },
  { id: "valentine", name: "Valentine's Day", vietnameseName: "Ngày Valentine", emoji: "💝", category: "Holidays" },
  { id: "easter", name: "Easter", vietnameseName: "Lễ Phục sinh", emoji: "🐰", category: "Holidays" },
  { id: "weddings", name: "Weddings", vietnameseName: "Hôn nhân", emoji: "💒", category: "Holidays" },
  { id: "festivals", name: "Festivals & Events", vietnameseName: "Lễ hội & Sự kiện", emoji: "🎉", category: "Holidays" },

  // Communication & Language
  { id: "phone", name: "Phone & Texting", vietnameseName: "Điện thoại & Tin nhắn", emoji: "☎️", category: "Language" },
  { id: "email", name: "Email & Writing", vietnameseName: "Email & Viết lách", emoji: "✉️", category: "Language" },
  { id: "conversation", name: "Conversation Starters", vietnameseName: "Cách bắt đầu cuộc trò chuyện", emoji: "💬", category: "Language" },
  { id: "small-talk", name: "Small Talk", vietnameseName: "Trò chuyện nhẹ", emoji: "😊", category: "Language" },
  { id: "expressions", name: "Common Expressions", vietnameseName: "Các biểu thức thông thường", emoji: "🗣️", category: "Language" },
  { id: "phrasal-verbs", name: "Phrasal Verbs", vietnameseName: "Động từ cụm", emoji: "📖", category: "Language" },
  { id: "collocations", name: "Collocations", vietnameseName: "Kết hợp từ", emoji: "🔗", category: "Language" },
  { id: "synonyms", name: "Synonyms", vietnameseName: "Từ đồng nghĩa", emoji: "↔️", category: "Language" },
  { id: "antonyms", name: "Antonyms", vietnameseName: "Từ trái nghĩa", emoji: "⚖️", category: "Language" },
  { id: "confusing", name: "Confusing Words", vietnameseName: "Từ gây nhầm lẫn", emoji: "❓", category: "Language" },
  { id: "slang", name: "Slang & Idioms", vietnameseName: "Tiếng lóng & Thành ngữ", emoji: "😎", category: "Language" },
  { id: "pronunciation", name: "Pronunciation Tips", vietnameseName: "Mẹo phát âm", emoji: "🔊", category: "Language" },

  // Society & Culture
  { id: "city-life", name: "City Life", vietnameseName: "Đời sống thành phố", emoji: "🏙️", category: "Culture" },
  { id: "countryside", name: "Countryside", vietnameseName: "Vùng nông thôn", emoji: "🌾", category: "Culture" },
  { id: "public-places", name: "Public Places", vietnameseName: "Nơi công cộng", emoji: "🏛️", category: "Culture" },
  { id: "buildings", name: "Buildings", vietnameseName: "Tòa nhà", emoji: "🏗️", category: "Culture" },
  { id: "history", name: "History", vietnameseName: "Lịch sử", emoji: "📜", category: "Culture" },
  { id: "government", name: "Government", vietnameseName: "Chính phủ", emoji: "🏛️", category: "Culture" },
  { id: "economics", name: "Economics", vietnameseName: "Kinh tế", emoji: "📈", category: "Culture" },
  { id: "crime", name: "Crime", vietnameseName: "Tội phạm", emoji: "🚨", category: "Culture" },
  { id: "religion", name: "Religion", vietnameseName: "Tôn giáo", emoji: "⛪", category: "Culture" },
  { id: "cultural-diff", name: "Cultural Differences", vietnameseName: "Sự khác biệt văn hóa", emoji: "🌍", category: "Culture" },
  { id: "social-issues", name: "Social Problems", vietnameseName: "Vấn đề xã hội", emoji: "⚠️", category: "Culture" },

  // Advanced Topics
  { id: "business-english", name: "Business English", vietnameseName: "Tiếng Anh kinh doanh", emoji: "💼", category: "Advanced" },
  { id: "legal", name: "Legal Terms", vietnameseName: "Các thuật ngữ pháp lý", emoji: "⚖️", category: "Advanced" },
  { id: "academic", name: "Academic Writing", vietnameseName: "Viết bài học thuật", emoji: "📚", category: "Advanced" },
  { id: "news", name: "News & Politics", vietnameseName: "Tin tức & Chính trị", emoji: "📰", category: "Advanced" },
  { id: "science", name: "Science & Research", vietnameseName: "Khoa học & Nghiên cứu", emoji: "🔬", category: "Advanced" },
  { id: "tech-advanced", name: "Technology & AI", vietnameseName: "Công nghệ & AI", emoji: "🔮", category: "Advanced" },
  { id: "philosophy", name: "Philosophy & Ethics", vietnameseName: "Triết học & Đạo đức", emoji: "🧘", category: "Advanced" },
];

// Utility functions
export const getTopicById = (id: string): FlashcardTopic | undefined => {
  return FLASHCARD_TOPICS.find(topic => topic.id === id);
};

export const getTopicsByCategory = (category: string): FlashcardTopic[] => {
  return FLASHCARD_TOPICS.filter(topic => topic.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(FLASHCARD_TOPICS.map(topic => topic.category))];
};

export const searchTopics = (keyword: string): FlashcardTopic[] => {
  const lowerKeyword = keyword.toLowerCase();
  return FLASHCARD_TOPICS.filter(
    topic =>
      topic.name.toLowerCase().includes(lowerKeyword) ||
      topic.vietnameseName.toLowerCase().includes(lowerKeyword)
  );
};