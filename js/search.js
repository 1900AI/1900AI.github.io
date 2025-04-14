document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const resultsContainer = document.getElementById('results-container');
    const categoryBoxes = document.querySelector('.category-boxes');
    
    // 存储所有文章数据
    let posts = [];
    
    // 获取所有文章数据
    fetch('/search.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
            console.log('文章数据加载完成:', posts.length);
        })
        .catch(error => console.error('加载搜索数据失败:', error));
    
    // 搜索函数
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            searchResults.style.display = 'none';
            categoryBoxes.style.display = 'grid';
            return;
        }
        
        const results = posts.filter(post => {
            return post.title.toLowerCase().includes(query) || 
                   post.content.toLowerCase().includes(query);
        });
        
        displayResults(results, query);
    }
    
    // 显示搜索结果
    function displayResults(results, query) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `<p class="no-results">未找到与 "${query}" 相关的文章</p>`;
        } else {
            results.forEach(post => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                // 高亮显示匹配的标题
                let title = post.title;
                if (title.toLowerCase().includes(query)) {
                    const regex = new RegExp(`(${query})`, 'gi');
                    title = title.replace(regex, '<span class="highlight">$1</span>');
                }
                
                // 提取匹配的内容片段
                let contentPreview = '';
                if (post.content.toLowerCase().includes(query)) {
                    const index = post.content.toLowerCase().indexOf(query);
                    const start = Math.max(0, index - 50);
                    const end = Math.min(post.content.length, index + query.length + 50);
                    contentPreview = post.content.substring(start, end);
                    
                    // 添加省略号
                    if (start > 0) contentPreview = '...' + contentPreview;
                    if (end < post.content.length) contentPreview += '...';
                    
                    // 高亮显示匹配的内容
                    const regex = new RegExp(`(${query})`, 'gi');
                    contentPreview = contentPreview.replace(regex, '<span class="highlight">$1</span>');
                } else {
                    // 如果内容中没有匹配，显示前100个字符
                    contentPreview = post.content.substring(0, 100) + '...';
                }
                
                resultItem.innerHTML = `
                    <h3><a href="${post.url}">${title}</a></h3>
                    <div class="result-date">${post.date}</div>
                    <p class="result-excerpt">${contentPreview}</p>
                `;
                
                resultsContainer.appendChild(resultItem);
            });
        }
        
        searchResults.style.display = 'block';
        categoryBoxes.style.display = 'none';
    }
    
    // 绑定搜索按钮点击事件
    searchButton.addEventListener('click', performSearch);
    
    // 绑定输入框回车事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 清空搜索框时恢复分类显示
    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            searchResults.style.display = 'none';
            categoryBoxes.style.display = 'grid';
        }
    });
});