import React, { useState } from 'react';
import { 
  ArrowLeft, Edit2, Save, X, Mail, Calendar, Award, 
  Bot, Heart, Share2, Settings, LogOut, Camera, 
  Sparkles, Crown, TrendingUp, Star
} from 'lucide-react';
import TechDivaLogo from '../common/TechDivaLogo';

const ProfilePage = ({ user, onUpdateProfile, onBack, onLogout, userChatbots = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || '',
    avatar: user.avatar
  });

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      bio: user.bio || '',
      avatar: user.avatar
    });
    setIsEditing(false);
  };

  // Calculate user stats
  const userStats = {
    chatbotCount: userChatbots.length,
    totalLikes: userChatbots.reduce((sum, bot) => sum + (bot.likes || 0), 0),
    totalShares: userChatbots.reduce((sum, bot) => sum + (bot.shares || 0), 0)
  };

  // Get user level based on activity
  const getUserLevel = () => {
    const total = userStats.chatbotCount + (userStats.totalLikes / 10);
    if (total >= 50) return { level: 'AI Master', color: '#ff67c7', icon: Crown };
    if (total >= 20) return { level: 'Bot Expert', color: '#ff9671', icon: Star };
    if (total >= 5) return { level: 'Rising Creator', color: '#0aabde', icon: TrendingUp };
    return { level: 'Starter', color: '#f8b500', icon: Sparkles };
  };

  const userLevel = getUserLevel();
  const LevelIcon = userLevel.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Header */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #ff67c7 0%, #ff9671 50%, #0aabde 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient 10s ease infinite'
          }}
        />
        
        {/* Floating shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float-delayed" />
        </div>

        <div className="relative z-10 text-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <button
              onClick={onBack}
              className="flex items-center text-white/90 hover:text-white transition mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Gallery
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <TechDivaLogo size="small" variant="white" />
                <h1 className="text-3xl font-bold">My Profile</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition transform hover:scale-105"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition transform hover:scale-105"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Profile Info Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full opacity-75 blur group-hover:opacity-100 transition"
                style={{
                  background: 'linear-gradient(135deg, #ff67c7 0%, #ff9671 100%)',
                }}
              />
              <img
                src={editData.avatar}
                alt={user.name}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white"
              />
              {isEditing && (
                <button 
                  className="absolute bottom-0 right-0 text-white p-2 rounded-full transform transition hover:scale-110"
                  style={{ backgroundColor: '#ff67c7' }}
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
              {/* User Level Badge */}
              <div 
                className="absolute -top-2 -right-2 p-2 rounded-full text-white"
                style={{ backgroundColor: userLevel.color }}
              >
                <LevelIcon className="w-5 h-5" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="text-2xl font-bold px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none w-full"
                    style={{ color: '#de790a' }}
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none resize-none"
                    rows="3"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-6 py-2 text-white rounded-xl transform transition hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h2 className="text-3xl font-bold" style={{ color: '#de790a' }}>{user.name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition"
                      style={{ color: '#ff9671' }}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white mb-3"
                    style={{ backgroundColor: userLevel.color }}
                  >
                    <LevelIcon className="w-4 h-4 mr-1" />
                    {userLevel.level}
                  </div>
                  <p className="text-gray-600 mb-4">{user.bio || 'No bio yet. Click edit to add one!'}</p>
                  <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" style={{ color: '#ff9671' }} />
                      {user.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" style={{ color: '#0aabde' }} />
                      Joined {new Date(user.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-8 border-t-2 border-gray-100">
            <div className="group transform transition hover:scale-105">
              <div 
                className="text-center p-6 rounded-2xl text-white relative overflow-hidden"
                style={{ backgroundColor: '#ff67c7' }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <Bot className="w-10 h-10 mx-auto mb-3 relative z-10" />
                <div className="text-3xl font-bold relative z-10">{userStats.chatbotCount}</div>
                <div className="text-white/90 relative z-10">Chatbots</div>
              </div>
            </div>
            
            <div className="group transform transition hover:scale-105">
              <div 
                className="text-center p-6 rounded-2xl text-white relative overflow-hidden"
                style={{ backgroundColor: '#ff9671' }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <Heart className="w-10 h-10 mx-auto mb-3 relative z-10" />
                <div className="text-3xl font-bold relative z-10">{userStats.totalLikes}</div>
                <div className="text-white/90 relative z-10">Total Likes</div>
              </div>
            </div>
            
            <div className="group transform transition hover:scale-105">
              <div 
                className="text-center p-6 rounded-2xl text-white relative overflow-hidden"
                style={{ backgroundColor: '#0aabde' }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <Share2 className="w-10 h-10 mx-auto mb-3 relative z-10" />
                <div className="text-3xl font-bold relative z-10">{userStats.totalShares}</div>
                <div className="text-white/90 relative z-10">Total Shares</div>
              </div>
            </div>
            
            <div className="group transform transition hover:scale-105">
              <div 
                className="text-center p-6 rounded-2xl text-white relative overflow-hidden"
                style={{ backgroundColor: userLevel.color }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <Award className="w-10 h-10 mx-auto mb-3 relative z-10" />
                <div className="text-2xl font-bold relative z-10">{userLevel.level}</div>
                <div className="text-white/90 relative z-10">Status</div>
              </div>
            </div>
          </div>

          {/* User's Chatbots */}
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#de790a' }}>My Chatbots</h3>
              <Sparkles className="w-6 h-6" style={{ color: '#ff67c7' }} />
            </div>
            
            {userChatbots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userChatbots.map(bot => (
                  <div 
                    key={bot.id} 
                    className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-pink-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl transform group-hover:scale-110 transition"
                          style={{ backgroundColor: bot.primaryColor || '#ff67c7' }}
                        >
                          {bot.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{bot.name}</h4>
                          <p className="text-sm" style={{ color: '#ff9671' }}>
                            {bot.categories.join(' • ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {bot.description || 'No description yet'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-600">
                          <Heart className="w-4 h-4 mr-1" style={{ color: '#ff67c7' }} />
                          {bot.likes || 0}
                        </span>
                        <span className="flex items-center text-gray-600">
                          <Share2 className="w-4 h-4 mr-1" style={{ color: '#0aabde' }} />
                          {bot.shares || 0}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bot.isPublic 
                          ? 'text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      style={bot.isPublic ? { backgroundColor: '#10b981' } : {}}>
                        {bot.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">
                  You haven't created any chatbots yet
                </p>
                <p className="text-gray-400 mt-2">
                  Start building your first AI chatbot now!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;