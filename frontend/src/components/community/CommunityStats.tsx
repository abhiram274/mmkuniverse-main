
const CommunityStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="glass-card p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-gradient-primary">500+</div>
        <div className="text-gray-400 text-sm">Community Members</div>
      </div>
      <div className="glass-card p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-gradient-primary">12</div>
        <div className="text-gray-400 text-sm">Active Groups</div>
      </div>
      <div className="glass-card p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-gradient-primary">230+</div>
        <div className="text-gray-400 text-sm">Weekly Discussions</div>
      </div>
      <div className="glass-card p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-gradient-primary">45</div>
        <div className="text-gray-400 text-sm">Online Now</div>
      </div>
    </div>
  );
};

export default CommunityStats;
