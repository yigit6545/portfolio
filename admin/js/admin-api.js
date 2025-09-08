// Admin Panel API Integration
class AdminAPI {
    constructor() {
        this.baseURL = '/admin/api';
        this.token = 'Bearer admin-token-123';
    }
    
    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token,
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Projects API
    async getProjects() {
        return this.request('projects.php');
    }
    
    async createProject(projectData) {
        return this.request('projects.php', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }
    
    async updateProject(id, projectData) {
        return this.request('projects.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...projectData })
        });
    }
    
    async deleteProject(id) {
        return this.request('projects.php', {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
    
    // Blog API
    async getBlogPosts() {
        return this.request('blog.php');
    }
    
    async createBlogPost(postData) {
        return this.request('blog.php', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    }
    
    async updateBlogPost(id, postData) {
        return this.request('blog.php', {
            method: 'PUT',
            body: JSON.stringify({ id, ...postData })
        });
    }
    
    async deleteBlogPost(id) {
        return this.request('blog.php', {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
    
    // Messages API
    async getMessages() {
        return this.request('messages.php');
    }
    
    async markMessageAsRead(id) {
        return this.request('messages.php', {
            method: 'PUT',
            body: JSON.stringify({ id, action: 'mark_read' })
        });
    }
    
    async markMessageAsReplied(id) {
        return this.request('messages.php', {
            method: 'PUT',
            body: JSON.stringify({ id, action: 'mark_replied' })
        });
    }
    
    async deleteMessage(id) {
        return this.request('messages.php', {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
}

// Initialize API instance
const adminAPI = new AdminAPI();

// Admin Panel UI Management
class AdminUI {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.loadDashboardData();
        this.setupEventListeners();
    }
    
    setupNavigation() {
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }
    
    showSection(section) {
        // Update navigation
        document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'projects': 'Projeler',
            'blog': 'Blog Yazıları',
            'messages': 'Mesajlar',
            'settings': 'Ayarlar',
            'analytics': 'Analitik'
        };
        
        document.getElementById('pageTitle').textContent = titles[section];
        this.currentSection = section;
        
        // Load section-specific data
        this.loadSectionData(section);
    }
    
    async loadSectionData(section) {
        try {
            switch (section) {
                case 'projects':
                    await this.loadProjects();
                    break;
                case 'blog':
                    await this.loadBlogPosts();
                    break;
                case 'messages':
                    await this.loadMessages();
                    break;
                case 'analytics':
                    await this.loadAnalytics();
                    break;
            }
        } catch (error) {
            console.error('Error loading section data:', error);
            this.showNotification('Veri yüklenirken hata oluştu', 'error');
        }
    }
    
    async loadDashboardData() {
        try {
            // Load dashboard statistics
            const [projectsData, blogData, messagesData] = await Promise.all([
                adminAPI.getProjects(),
                adminAPI.getBlogPosts(),
                adminAPI.getMessages()
            ]);
            
            // Update statistics
            this.updateStats({
                projects: projectsData.data.length,
                blog: blogData.data.length,
                messages: messagesData.data.length,
                visitors: 1234 // This would come from analytics API
            });
            
            // Update recent activities
            this.updateRecentActivities(projectsData.data, blogData.data, messagesData.data);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    updateStats(stats) {
        const statElements = {
            projects: document.querySelector('.stat-card:nth-child(1) .stat-number'),
            blog: document.querySelector('.stat-card:nth-child(2) .stat-number'),
            messages: document.querySelector('.stat-card:nth-child(3) .stat-number'),
            visitors: document.querySelector('.stat-card:nth-child(4) .stat-number')
        };
        
        Object.keys(stats).forEach(key => {
            if (statElements[key]) {
                statElements[key].textContent = stats[key];
            }
        });
    }
    
    updateRecentActivities(projects, blogPosts, messages) {
        const activitiesContainer = document.querySelector('#dashboard .admin-card:last-child div');
        if (!activitiesContainer) return;
        
        const activities = [];
        
        // Recent projects
        const recentProjects = projects.slice(0, 2);
        recentProjects.forEach(project => {
            activities.push(`• Yeni proje eklendi: "${project.title}"`);
        });
        
        // Recent blog posts
        const recentPosts = blogPosts.slice(0, 2);
        recentPosts.forEach(post => {
            activities.push(`• Blog yazısı yayınlandı: "${post.title}"`);
        });
        
        // Recent messages
        const unreadMessages = messages.filter(msg => msg.status === 'unread').length;
        if (unreadMessages > 0) {
            activities.push(`• ${unreadMessages} yeni mesaj alındı`);
        }
        
        activitiesContainer.innerHTML = activities.map(activity => 
            `<p style="color: var(--text-secondary); margin: 0.5rem 0;">${activity}</p>`
        ).join('');
    }
    
    async loadProjects() {
        try {
            const response = await adminAPI.getProjects();
            this.renderProjectsTable(response.data);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
    
    renderProjectsTable(projects) {
        const tableBody = document.querySelector('#projects .admin-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = projects.map(project => `
            <tr>
                <td>${project.title}</td>
                <td>${project.category}</td>
                <td><span style="color: ${this.getStatusColor(project.status)}">${this.getStatusText(project.status)}</span></td>
                <td>${project.created_at}</td>
                <td>
                    <button class="btn-admin btn-admin-secondary" style="padding: 0.5rem; margin-right: 0.5rem;" onclick="adminUI.editProject(${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-admin btn-admin-danger" style="padding: 0.5rem;" onclick="adminUI.deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    async loadBlogPosts() {
        try {
            const response = await adminAPI.getBlogPosts();
            this.renderBlogTable(response.data);
        } catch (error) {
            console.error('Error loading blog posts:', error);
        }
    }
    
    renderBlogTable(posts) {
        const tableBody = document.querySelector('#blog .admin-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = posts.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td><span style="color: ${this.getStatusColor(post.status)}">${this.getStatusText(post.status)}</span></td>
                <td>${post.created_at}</td>
                <td>
                    <button class="btn-admin btn-admin-secondary" style="padding: 0.5rem; margin-right: 0.5rem;" onclick="adminUI.editBlogPost(${post.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-admin btn-admin-danger" style="padding: 0.5rem;" onclick="adminUI.deleteBlogPost(${post.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    async loadMessages() {
        try {
            const response = await adminAPI.getMessages();
            this.renderMessagesTable(response.data);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
    
    renderMessagesTable(messages) {
        const tableBody = document.querySelector('#messages .admin-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = messages.map(message => `
            <tr>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.subject}</td>
                <td>${message.created_at}</td>
                <td><span style="color: ${this.getStatusColor(message.status)}">${this.getStatusText(message.status)}</span></td>
                <td>
                    <button class="btn-admin btn-admin-primary" style="padding: 0.5rem; margin-right: 0.5rem;" onclick="adminUI.viewMessage(${message.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-admin btn-admin-danger" style="padding: 0.5rem;" onclick="adminUI.deleteMessage(${message.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    getStatusColor(status) {
        const colors = {
            'active': '#10b981',
            'development': '#f59e0b',
            'published': '#10b981',
            'draft': '#f59e0b',
            'unread': '#f59e0b',
            'read': '#10b981',
            'replied': '#3b82f6'
        };
        return colors[status] || '#6b7280';
    }
    
    getStatusText(status) {
        const texts = {
            'active': 'Aktif',
            'development': 'Geliştiriliyor',
            'published': 'Yayında',
            'draft': 'Taslak',
            'unread': 'Okunmadı',
            'read': 'Okundu',
            'replied': 'Yanıtlandı'
        };
        return texts[status] || status;
    }
    
    showNotification(message, type = 'info') {
        // Use the notification system from main script
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }
    
    setupEventListeners() {
        // Add any additional event listeners here
    }
    
    // Project management methods
    async editProject(id) {
        this.showNotification('Proje düzenleme formu açılacak', 'info');
    }
    
    async deleteProject(id) {
        if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
            try {
                await adminAPI.deleteProject(id);
                this.showNotification('Proje başarıyla silindi', 'success');
                this.loadProjects();
            } catch (error) {
                this.showNotification('Proje silinirken hata oluştu', 'error');
            }
        }
    }
    
    // Blog management methods
    async editBlogPost(id) {
        this.showNotification('Blog yazısı düzenleme formu açılacak', 'info');
    }
    
    async deleteBlogPost(id) {
        if (confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
            try {
                await adminAPI.deleteBlogPost(id);
                this.showNotification('Blog yazısı başarıyla silindi', 'success');
                this.loadBlogPosts();
            } catch (error) {
                this.showNotification('Blog yazısı silinirken hata oluştu', 'error');
            }
        }
    }
    
    // Message management methods
    async viewMessage(id) {
        this.showNotification('Mesaj detayları açılacak', 'info');
    }
    
    async deleteMessage(id) {
        if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
            try {
                await adminAPI.deleteMessage(id);
                this.showNotification('Mesaj başarıyla silindi', 'success');
                this.loadMessages();
            } catch (error) {
                this.showNotification('Mesaj silinirken hata oluştu', 'error');
            }
        }
    }
    
    async loadAnalytics() {
        // This would integrate with Google Analytics API
        this.showNotification('Analitik verileri yükleniyor...', 'info');
    }
}

// Initialize Admin UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the admin panel
    if (document.getElementById('adminPanel')) {
        window.adminUI = new AdminUI();
    }
});

