// 导航页面应用逻辑 - 工具导航面板的核心实现

// 工具组配置数据，包含不同分类的工具列表
const toolGroups = [
    {
        title: '开发工具', items: [
            {
                title: 'JSON 转表格工具',
                textIcon: 'JSON',
                description: '将JSON数据转换为表格视图，支持校验、格式化、转义、压缩等功能，支持多种格式的数据复制与导出',
                link: 'json_table_tool.html'
            },
            {
                title: '接口文档',
                textIcon: 'API',
                description: '在线查看与测试后端 API（Swagger / Knife4j）',
                link: '#'
            },
            {
                title: '绘图工具',
                icon: 'https://ww135.top:23456/HC/icon/drawio.png',
                description: '在线绘图工具，支持绘制点、线、面等几何形状，支持自定义样式与属性',
                link: 'https://ww135.top:8443/drawio'
            }
        ]
    },
    {
        title: '运维 / 监控', items: [
            {title: '监控看板', textIcon: 'OPS', description: 'Prometheus / Grafana 监控仪表盘', link: '#'},
            {
                title: "测试一下",
                icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='%2366d9ff'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-size='26' font-family='Arial' fill='white'>API</text></svg>",
                description: "测试工具，测试描述信息，测试描述信息，测试描述信息测试描述信息测试描述信息",
                link: "https://example.com/api-docs",
            },
        ]
    }
];

/**
 * 根据字符串生成哈希颜色
 * @param {string} str - 输入字符串
 * @returns {string} - 生成的渐变色CSS字符串
 */
function hashColor(str) {
    let h = 0;
    for (let c of str) h = (h << 5) - h + c.charCodeAt(0);
    const hue = Math.abs(h) % 360;
    return `linear-gradient(135deg,hsl(${hue} 90% 65%),hsl(${(hue + 30) % 360} 85% 55%))`
}

/**
 * 根据输入生成图标文本
 * @param {string} s - 输入字符串
 * @returns {string} - 处理后的图标文本
 */
function makeText(s) {
    if (/[\u4e00-\u9fff]/.test(s[0])) return s.slice(0, 2);
    return s.slice(0, 4).toUpperCase()
}

/**
 * 渲染工具卡片
 * @param {Object} item - 工具项数据
 * @returns {HTMLElement} - 生成的工具卡片元素
 */
function renderTile(item) {
    const a = document.createElement('a');
    a.className = 'tile';
    a.href = item.link;
    a.target = '_blank';
    a.setAttribute('aria-label', `${item.title}: ${item.description}`);
    a.setAttribute('role', 'link');

    const front = document.createElement('div');
    front.className = 'tile-front';
    const icon = document.createElement('div');
    icon.className = 'icon';
    
    if (item.icon) {
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = `${item.title} 图标`;
        icon.appendChild(img);
    } else {
        icon.style.background = hashColor(item.textIcon || item.title);
        icon.textContent = makeText(item.textIcon || item.title);
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', item.title);
    }
    
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = item.title;
    front.append(icon, title);

    const back = document.createElement('div');
    back.className = 'tile-back';
    const bt = document.createElement('div');
    bt.className = 'title';
    bt.textContent = item.title;
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = item.description || '';
    back.append(bt, desc);

    a.append(front, back);
    return a;
}

/**
 * 渲染工具组
 * @param {Object} groupData - 工具组数据
 * @returns {HTMLElement} - 生成的工具组元素
 */
function renderGroup(groupData) {
    const group = document.createElement('section'); // 使用语义化的section标签
    group.className = 'group';
    group.setAttribute('role', 'region');
    group.setAttribute('aria-labelledby', `group-title-${groupData.title}`);
    
    const groupTitle = document.createElement('h2'); // 使用语义化的h2标签
    groupTitle.id = `group-title-${groupData.title}`;
    groupTitle.className = 'group-title';
    groupTitle.textContent = groupData.title;
    groupTitle.setAttribute('role', 'heading');
    groupTitle.setAttribute('aria-level', '2');
    
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.setAttribute('role', 'grid');

    groupData.items.forEach((item, index) => {
        const tile = renderTile(item);
        tile.setAttribute('role', 'gridcell');
        grid.appendChild(tile);
    });

    group.append(groupTitle, grid);
    return group;
}

/**
 * 初始化应用
 */
function initApp() {
    const container = document.getElementById('container');
    
    // 渲染所有工具组
    renderAllGroups();
    
    // 初始化搜索功能
    initSearch();
}

/**
 * 渲染所有工具组
 */
function renderAllGroups() {
    const container = document.getElementById('container');
    container.innerHTML = ''; // 清空容器
    
    toolGroups.forEach(groupData => {
        const groupElement = renderGroup(groupData);
        container.appendChild(groupElement);
    });
}

/**
 * 搜索工具并显示结果
 * @param {string} query - 搜索关键词
 */
function searchTools(query) {
    const container = document.getElementById('container');
    container.innerHTML = ''; // 清空容器
    
    // 如果没有搜索词，显示所有工具
    if (!query.trim()) {
        renderAllGroups();
        return;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    const matchedGroups = [];
    
    // 筛选匹配的工具组和工具
    toolGroups.forEach(groupData => {
        const matchedItems = groupData.items.filter(item => {
            return item.title.toLowerCase().includes(lowerQuery) ||
                   item.description.toLowerCase().includes(lowerQuery);
        });
        
        if (matchedItems.length > 0) {
            matchedGroups.push({
                ...groupData,
                items: matchedItems
            });
        }
    });
    
    // 渲染匹配的结果
    matchedGroups.forEach(groupData => {
        const groupElement = renderGroup(groupData);
        container.appendChild(groupElement);
    });
}

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('tool-search');
    
    // 防抖函数，减少搜索频率
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchTools(e.target.value);
        }, 200); // 200ms防抖延迟
    });
    
    // 支持Enter键搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchTools(e.target.value);
        }
    });
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);
