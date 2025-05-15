document.addEventListener('DOMContentLoaded', function() {
  const commentsContainer = document.getElementById('latest-comments-category-container');
  
  // 加载 LeanCloud SDK
  const script = document.createElement('script');
  script.src = '//cdn.jsdelivr.net/npm/leancloud-storage@4.12.0/dist/av-min.js';
  document.head.appendChild(script);
  
  script.onload = function() {
    // 初始化 LeanCloud
    AV.init({
      appId: window.valineConfig.appId,
      appKey: window.valineConfig.appKey,
      serverURLs: window.valineConfig.serverURLs
    });
    
    // 查询最新评论
    const query = new AV.Query('Comment');
    query.descending('createdAt');
    query.limit(3);
    query.find().then(comments => {
      if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>暂无评论</p>';
        return;
      }
      
      let html = '<div class="comment-list">';
      
      comments.forEach(comment => {
        const commentData = comment.toJSON();
        html += `
          <a href="${commentData.url}#${commentData.objectId}" class="comment-item">
            <div class="comment-content">${commentData.comment}</div>
            <div class="comment-meta">
              <span class="comment-author">${commentData.nick || '匿名用户'}</span>
              <span class="comment-date">${new Date(commentData.createdAt).toLocaleDateString()}</span>
            </div>
          </a>
        `;
      });
      
      html += '</div>';
      commentsContainer.innerHTML = html;
    }).catch(error => {
      console.error('获取评论失败:', error);
      commentsContainer.innerHTML = '<p>获取评论失败，请刷新重试</p>';
    });
  };
  
  script.onerror = function() {
    commentsContainer.innerHTML = '<p>LeanCloud SDK 加载失败，请检查网络连接</p>';
  };
});