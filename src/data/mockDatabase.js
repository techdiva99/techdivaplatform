export const mockDatabase = {
  users: [
    {
      id: 'user_1',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=ff67c7&color=fff', // Changed to URL
      bio: 'Tech enthusiast, mother, and travel lover',
      joinedDate: '2024-01-15T10:30:00Z', // Changed to ISO format
      isPremium: true,
      chatbotCount: 2, // Added for profile stats
      totalLikes: 1817 // Added for profile stats
    },
    {
      id: 'user_2',
      name: 'Sarah Tech',
      email: 'sarah.tech@example.com', // This is the demo login email
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Tech&background=ff9671&color=fff',
      bio: 'AI developer and chatbot enthusiast. Building the future one bot at a time!',
      joinedDate: '2024-02-01T14:20:00Z',
      isPremium: false,
      chatbotCount: 0,
      totalLikes: 0
    }
  ],
  chatbots: [
    {
      id: 'bot_1',
      userId: 'user_1',
      name: 'TechDIVA Original',
      description: 'AI companion for women in tech - coding, career, parenting, and more!',
      avatar: '💜',
      isPublic: true,
      likes: 1250,
      shares: 89,
      categories: ['coding', 'career', 'parenting', 'travel', 'recipes'],
      primaryColor: '#ff67c7',
      createdAt: '2024-01-15T10:45:00Z', // Changed to ISO format
      lastUpdated: '2024-03-20T15:30:00Z',
      responseCount: 45,
      tags: ['women-in-tech', 'mentorship', 'indian-culture', 'work-life-balance'],
      responses: {
        'hello': ['Hello! Welcome to TechDIVA! How can I help you today? 💜'],
        'help': ['I can assist you with coding, career advice, parenting tips, travel recommendations, and recipes!'],
        'coding': ['What programming language or concept would you like to explore?'],
        'career': ['Let\'s talk about your career goals! Are you looking for advice on job hunting, skill development, or work-life balance?']
      }
    },
    {
      id: 'bot_2', 
      userId: 'user_1',
      name: 'Fitness Guru',
      description: 'Your personal fitness and wellness companion',
      avatar: '💪',
      isPublic: true,
      likes: 567,
      shares: 34,
      categories: ['fitness', 'nutrition', 'wellness'],
      primaryColor: '#22c55e',
      createdAt: '2024-02-10T08:00:00Z',
      lastUpdated: '2024-03-18T09:15:00Z',
      responseCount: 23,
      tags: ['fitness', 'healthy-living', 'yoga', 'motivation'],
      responses: {
        'hello': ['Hey there! Ready to crush your fitness goals? 💪'],
        'help': ['I can help you with workout routines, nutrition advice, and wellness tips!'],
        'workout': ['What type of workout are you interested in? Strength training, cardio, or yoga?'],
        'diet': ['Let\'s talk nutrition! Are you looking for meal plans, healthy recipes, or dietary advice?']
      }
    },
    {
      id: 'bot_3',
      userId: 'user_2',
      name: 'Code Mentor',
      description: 'Your coding companion for learning and debugging',
      avatar: '🚀',
      isPublic: true,
      likes: 342,
      shares: 28,
      categories: ['programming', 'debugging', 'tutorials'],
      primaryColor: '#0aabde',
      createdAt: '2024-02-15T12:00:00Z',
      lastUpdated: '2024-03-19T14:20:00Z',
      responseCount: 35,
      tags: ['coding', 'mentorship', 'javascript', 'python'],
      responses: {
        'hello': ['Hello coder! What programming challenge can I help you with today? 🚀'],
        'help': ['I can help you learn programming, debug code, or explain concepts!']
      }
    }
  ]
};