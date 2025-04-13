document.addEventListener('DOMContentLoaded', function() {
    const tocLinks = document.querySelectorAll('.toc-content a');
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
    
    if (tocLinks.length === 0 || headings.length === 0) return;
    
    // 获取目标元素的ID
    function getIdFromHref(href) {
        return href.substring(href.indexOf('#') + 1);
    }
    
    // 高亮当前活跃的目录项
    function highlightToc() {
        let currentHeadingIndex = -1;
        const scrollPosition = window.scrollY;
        
        // 找到当前滚动位置对应的标题
        for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            if (heading.offsetTop - 100 <= scrollPosition) {
                currentHeadingIndex = i;
            } else {
                break;
            }
        }
        
        // 移除所有活跃类
        tocLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // 如果找到了当前标题，高亮对应的目录项
        if (currentHeadingIndex >= 0) {
            const currentHeading = headings[currentHeadingIndex];
            const id = currentHeading.id;
            
            tocLinks.forEach(link => {
                const linkId = getIdFromHref(link.getAttribute('href'));
                if (linkId === id) {
                    link.parentElement.classList.add('active');
                }
            });
        }
    }
    
    // 初始高亮
    highlightToc();
    
    // 滚动时更新高亮
    window.addEventListener('scroll', highlightToc);
    
    // 为二级标题添加展开/折叠功能
    setupCollapsibleToc();
});

// 设置可折叠目录
function setupCollapsibleToc() {
    // 获取所有二级目录项
    const level2Items = document.querySelectorAll('.toc-content > ol > li');
    
    level2Items.forEach(item => {
        // 检查是否有子目录
        const subList = item.querySelector('ol');
        if (subList) {
            // 初始隐藏子目录
            subList.style.display = 'none';
            
            // 创建展开/折叠按钮
            const toggleBtn = document.createElement('span');
            toggleBtn.className = 'toc-toggle';
            toggleBtn.innerHTML = '+';
            toggleBtn.title = '展开子目录';
            
            // 将按钮添加到标题右侧（而不是前面）
            const link = item.querySelector('a');
            link.appendChild(toggleBtn);
            
            // 添加点击事件
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (subList.style.display === 'none') {
                    subList.style.display = 'block';
                    toggleBtn.innerHTML = '-';
                    toggleBtn.title = '折叠子目录';
                } else {
                    subList.style.display = 'none';
                    toggleBtn.innerHTML = '+';
                    toggleBtn.title = '展开子目录';
                }
            });
        }
    });
}