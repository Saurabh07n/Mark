import React from 'react';

interface PostsManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredPosts: any[];
  loading: boolean;
  error: string | null;
  selectedPost: any;
  setSelectedPost: (post: any) => void;
  formatDate: (dateString: string) => string;
  getPlatformIcon: (platform: string[]) => JSX.Element | null;
}

const PostsManagement: React.FC<PostsManagementProps> = ({
  activeTab,
  setActiveTab,
  filteredPosts,
  loading,
  error,
  selectedPost,
  setSelectedPost,
  formatDate,
  getPlatformIcon,
}) => {
  return (
    <div
      id="posts-container"
      className={`absolute left-1/2 transform -translate-x-1/2 w-[95%] max-w-full overflow-x-hidden overflow-y-auto rounded-[10px] bg-gray-200/30 bottom-0 ${
        selectedPost ? 'top-[450px]' : 'top-[150px]'
      }`}
    >
      <div className="flex justify-center m-[20px_30px] pb-[10px]">
        {['past', 'upcoming', 'drafts'].map(tab => (
          <button
            key={tab}
            id={activeTab === tab ? 'active-tab-button' : 'tab-button'}
            className={`flex-1 text-center p-[10px] cursor-pointer text-sm ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 font-bold text-blue-500'
                : 'font-normal border-b-2 border-grey-200 text-black transition-all duration-200 hover:text-gray-600 hover:bg-gray-100'
            } px-[15px] py-[8px]`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Posts
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[5px]">
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && filteredPosts.length === 0 && (
          <p className="text-center text-gray-600">No posts found.</p>
        )}
        {filteredPosts.map((post, index) => {
          const media = post.mediaUrl?.[0];
          const isImage = media && /\.(jpg|jpeg|png|gif)$/i.test(media);
          const isVideo = media && /\.(mp4|mov|webm)$/i.test(media);

          return (
            <div
              key={post._id}
              id="post-item"
              className={`p-5 rounded-lg overflow-hidden box-border flex justify-between items-center transition-all duration-200 m-[0_30px_15px_30px] hover:translate-x-[5px] ${
                index % 2 ? 'bg-[#F2E9C9]' : 'bg-[#E3D6F3]'
              }`}
              onClick={() => setSelectedPost(post)}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-[50px] h-[50px] mr-[15px] flex-shrink-0 flex items-center justify-center overflow-hidden rounded-[6px] bg-gray-100 border border-gray-300">
                {isImage && (
                  <img src={media} alt="Media Preview" className="max-w-full max-h-full object-cover rounded" />
                )}
                {isVideo && (
                  <video className="max-w-full max-h-full object-cover rounded" muted>
                    <source src={media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="flex-1 min-w-0 break-words">
                <h4 id="post-title" className="m-0 mb-[5px] data-cy='post-title' text-base text-gray-800 font-semibold">
                  {post.title}
                </h4>
                <p id="post-date" className="m-0 text-[13px] text-black font-normal">
                  {formatDate(post.scheduleDate || post.createdAt)}
                </p>
              </div>

              {getPlatformIcon(post.platform)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostsManagement;