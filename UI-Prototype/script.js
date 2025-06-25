// Sparkle Player UI Prototype JavaScript

class SparklePlayerUI {
    constructor() {
        this.currentTheme = 'dark';
        this.isPlaying = true;
        this.currentTime = 0;
        this.totalTime = 237; // 3:57 in seconds
        this.volume = 0.7;
        this.currentSong = 1;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAnimations();
        this.updateProgress();
        // 初始化时应用主题图标
        this.updatePlayerIconsTheme();
    }
    
    bindEvents() {
        // 主题切换
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // 播放控制
        const playPauseBtn = document.querySelector('.main-play');
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        const prevBtn = document.querySelector('.previous');
        prevBtn.addEventListener('click', () => this.previousSong());
        
        const nextBtn = document.querySelector('.next');
        nextBtn.addEventListener('click', () => this.nextSong());
        
        // 歌曲列表项点击
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => this.playSong(index + 1));
            item.addEventListener('contextmenu', (e) => this.showContextMenu(e));
        });
        
        // 进度条交互
        const progressBar = document.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => this.seekTo(e));
        
        // 音量控制
        const volumeSlider = document.querySelector('.volume-slider');
        volumeSlider.addEventListener('click', (e) => this.setVolume(e));
        
        // 收藏按钮
        const likeButtons = document.querySelectorAll('.action-icon.like');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLike(btn);
            });
        });
        
        // 播放列表中的播放按钮
        const playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSong(index + 1);
            });
        });
        
        // 侧边栏导航
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchPage(item);
            });
        });
        
        // 搜索框动画
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('focus', () => this.animateSearchFocus());
        searchInput.addEventListener('blur', () => this.animateSearchBlur());
        
        // 隐藏上下文菜单
        document.addEventListener('click', () => this.hideContextMenu());
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // 窗口调整大小
        window.addEventListener('resize', () => this.handleResize());
    }
    
    toggleTheme() {
        const container = document.getElementById('appContainer');
        const themeText = document.querySelector('.theme-toggle-btn .theme-text');
        
        if (this.currentTheme === 'dark') {
            container.classList.add('light-theme');
            themeText.textContent = 'L';
            this.currentTheme = 'light';
        } else {
            container.classList.remove('light-theme');
            themeText.textContent = 'D';
            this.currentTheme = 'dark';
        }
        
        // 更新播放器图标主题
        this.updatePlayerIconsTheme();
        
        // 主题切换动画
        this.animateThemeTransition();
    }
    
    updatePlayerIconsTheme() {
        const icons = document.querySelectorAll('.control-icon, .control-icon-main, .extra-icon, .volume-icon, .nav-icon, .section-icon, .btn-icon, .play-icon, .menu-icon, .search-icon, .icon');
        icons.forEach(icon => {
            if (icon.src) {
                let iconPath = icon.src;
                if (this.currentTheme === 'dark') {
                    // 深色模式使用浅色图标 (_d.ico)
                    if (!iconPath.includes('_d.ico')) {
                        iconPath = iconPath.replace('.ico', '_d.ico');
                    }
                } else {
                    // 浅色模式使用深色图标 (.ico)
                    iconPath = iconPath.replace('_d.ico', '.ico');
                }
                icon.src = iconPath;
            }
        });
    }
    
    animateThemeTransition() {
        const container = document.getElementById('appContainer');
        container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // 添加涟漪效果
        this.createRippleEffect(event.target);
    }
    
    togglePlayPause() {
        const playIcon = document.querySelector('.main-play .control-icon-main');
        const coverImage = document.querySelector('.current-cover-placeholder');
        
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            let iconSrc = 'assets/Icons/pause_player_icon_227425.ico';
            // 应用主题相关的图标
            if (this.currentTheme === 'dark') {
                iconSrc = iconSrc.replace('.ico', '_d.ico');
            }
            playIcon.src = iconSrc;
            playIcon.alt = '暂停';
            if (coverImage) coverImage.classList.add('rotating');
            this.animatePlayButton('play');
        } else {
            let iconSrc = 'assets/Icons/player_play_icon_227418.ico';
            // 应用主题相关的图标
            if (this.currentTheme === 'dark') {
                iconSrc = iconSrc.replace('.ico', '_d.ico');
            }
            playIcon.src = iconSrc;
            playIcon.alt = '播放';
            if (coverImage) coverImage.classList.remove('rotating');
            this.animatePlayButton('pause');
        }
    }
    
    animatePlayButton(action) {
        const playBtn = document.querySelector('.main-play');
        
        // 脉冲动画
        playBtn.style.animation = 'pulse 0.3s ease-out';
        
        setTimeout(() => {
            playBtn.style.animation = '';
        }, 300);
    }
    
    playSong(songNumber) {
        // 移除当前播放状态
        const currentPlaying = document.querySelector('.song-item.playing');
        if (currentPlaying) {
            currentPlaying.classList.remove('playing');
        }
        
        // 设置新的播放状态
        const newSong = document.querySelector(`[data-song="${songNumber}"]`);
        if (newSong) {
            newSong.classList.add('playing');
            this.currentSong = songNumber;
            
            // 更新播放器信息
            this.updatePlayerInfo(songNumber);
            
            // 动画效果
            this.animateSongSelection(newSong);
        }
    }
    
    updatePlayerInfo(songNumber) {
        const songs = [
            {
                title: 'ゆめいろハナミズキ',
                artist: '東山奈央',
                cover: null
            },
            {
                title: '汎用合成クラスメイト・宇佐見05号',
                artist: 'めらみぽっぷ/滑叶櫻',
                cover: null
            },
            {
                title: 'トライアングル',
                artist: '藤田麻衣子/美聖子',
                cover: null
            },
            {
                title: '青い空のカミュ full',
                artist: '神月はるか/BLUE DOOR RECORD',
                cover: null
            }
        ];
        
        const song = songs[songNumber - 1];
        if (song) {
            document.querySelector('.song-title').textContent = song.title;
            document.querySelector('.song-artist').textContent = song.artist;
            document.querySelector('.current-song-title').textContent = `${song.title} - ${song.artist}`;
        }
    }
    
    animateSongSelection(songElement) {
        // 高亮动画
        songElement.style.background = 'rgba(108, 160, 220, 0.2)';
        songElement.style.transform = 'translateX(8px) scale(1.02)';
        
        setTimeout(() => {
            songElement.style.background = '';
            songElement.style.transform = '';
        }, 300);
    }
    
    previousSong() {
        if (this.currentSong > 1) {
            this.playSong(this.currentSong - 1);
        }
    }
    
    nextSong() {
        const maxSongs = document.querySelectorAll('.song-item').length;
        if (this.currentSong < maxSongs) {
            this.playSong(this.currentSong + 1);
        }
    }
    
    seekTo(event) {
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percentage = (event.clientX - rect.left) / rect.width;
        
        this.currentTime = Math.floor(this.totalTime * percentage);
        this.updateProgressBar();
        
        // 添加点击动画
        this.createClickEffect(event.clientX - rect.left, progressBar);
    }
    
    createClickEffect(x, element) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            left: ${x - 10}px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            background: var(--primary);
            border-radius: 50%;
            opacity: 0.6;
            animation: ripple 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(effect);
        
        setTimeout(() => {
            element.removeChild(effect);
        }, 600);
    }
    
    setVolume(event) {
        const volumeSlider = event.currentTarget;
        const rect = volumeSlider.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        
        this.volume = percentage;
        this.updateVolumeDisplay();
        
        // 音量变化动画
        this.animateVolumeChange();
    }
    
    updateVolumeDisplay() {
        const volumeFill = document.querySelector('.volume-fill');
        const volumeHandle = document.querySelector('.volume-handle');
        const volumeIcon = document.querySelector('.volume-icon');
        
        const percentage = this.volume * 100;
        volumeFill.style.width = `${percentage}%`;
        volumeHandle.style.left = `${percentage}%`;
        
        // 更新音量图标
        let iconSrc;
        if (this.volume === 0) {
            iconSrc = 'assets/Icons/off_volume_icon_227432.ico';
            volumeIcon.alt = '静音';
        } else if (this.volume < 0.5) {
            iconSrc = 'assets/Icons/down_volume_icon_227421.ico';
            volumeIcon.alt = '低音量';
        } else {
            iconSrc = 'assets/Icons/up_volume_icon_227422.ico';
            volumeIcon.alt = '高音量';
        }
        
        // 应用主题
        if (this.currentTheme === 'dark') {
            iconSrc = iconSrc.replace('.ico', '_d.ico');
        }
        volumeIcon.src = iconSrc;
    }
    
    animateVolumeChange() {
        const volumeControl = document.querySelector('.volume-control');
        volumeControl.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            volumeControl.style.transform = '';
        }, 150);
    }
    
    toggleLike(button) {
        const icon = button.querySelector('.heart-icon');
        const isLiked = button.classList.contains('active');
        
        if (isLiked) {
            button.classList.remove('active');
            icon.textContent = '♡';
        } else {
            button.classList.add('active');
            icon.textContent = '♥';
            
            // 爱心动画
            this.createHeartAnimation(button);
        }
    }
    
    createHeartAnimation(button) {
        // 添加粒子效果
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = '♥';
            particle.style.cssText = `
                position: absolute;
                color: #ff4757;
                font-size: 12px;
                pointer-events: none;
                animation: heartParticle 1s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            
            button.style.position = 'relative';
            button.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    button.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    switchNavItem(clickedItem) {
        // 移除所有活动状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            // 清除可能的内联样式
            item.style.background = '';
        });
        
        // 添加新的活动状态
        clickedItem.classList.add('active');
        
        // 获取页面类型
        const pageType = clickedItem.querySelector('span').textContent.trim();
        
        // 切换页面内容
        this.switchPageContent(pageType);
        
        // 导航切换动画
        this.animateNavSwitch(clickedItem);
    }
    
    switchPageContent(pageType) {
        const contentArea = document.querySelector('.content-area');
        
        if (pageType === '歌曲') {
            // 显示歌曲列表（当前页面内容）
            contentArea.innerHTML = this.getSongListContent();
            // 重新绑定歌曲相关事件
            this.rebindSongEvents();
        } else {
            // 其他页面显示空白内容
            contentArea.innerHTML = this.getEmptyPageContent(pageType);
        }
        
        // 重新应用主题图标
        this.updatePlayerIconsTheme();
    }
    
    rebindSongEvents() {
        // 重新绑定歌曲列表项点击事件
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => this.playSong(index + 1));
            item.addEventListener('contextmenu', (e) => this.showContextMenu(e));
        });
        
        // 重新绑定播放按钮事件
        const playAllBtn = document.querySelector('.play-all-btn');
        if (playAllBtn) {
            playAllBtn.addEventListener('click', () => this.playAll());
        }
        
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.textContent.includes('播放全部')) {
                    this.playAll();
                } else if (btn.textContent.includes('随机播放')) {
                    this.shufflePlay();
                }
            });
        });
    }
    
    getSongListContent() {
        return `
            <!-- 横幅区域 -->
            <section class="hero-banner">
                <div class="banner-slide active">
                    <div class="banner-background">
                        <img src="assets/banner1.jpg" alt="Featured Music">
                    </div>
                    <div class="banner-content">
                        <h2 class="banner-title">全部音乐</h2>
                        <p class="banner-subtitle">发现你喜欢的音乐</p>
                        <button class="play-all-btn">
                            <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="btn-icon">
                            全部播放 (共3218首)
                        </button>
                    </div>
                </div>
            </section>

            <!-- 功能按钮区 -->
            <section class="action-bar">
                <div class="action-buttons">
                    <button class="action-btn primary">
                        <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="btn-icon">
                        播放全部
                    </button>
                    <button class="action-btn">
                        <img src="assets/Icons/playlist_shuffle_icon_227435_d.ico" alt="随机播放" class="btn-icon">
                        随机播放
                    </button>
                </div>
            </section>

            <!-- 歌曲列表 -->
            <section class="song-list">
                <div class="list-header">
                    <div class="header-cell index">#</div>
                    <div class="header-cell title">歌曲</div>
                    <div class="header-cell artist">艺术家</div>
                    <div class="header-cell album">专辑</div>
                    <div class="header-cell duration">时长</div>
                    <div class="header-cell actions"></div>
                </div>
                
                <div class="song-items">
                    <!-- 歌曲项目 -->
                    <div class="song-item playing" data-song="1">
                        <div class="cell index">
                            <span class="song-number">1</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">ゆめいろハナミズキ</span>
                                    <div class="song-tags">
                                        <span class="tag quality">182K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">東山奈央</div>
                        <div class="cell album">ゆめいろハナミズキ</div>
                        <div class="cell duration">03:57</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>

                    <div class="song-item" data-song="2">
                        <div class="cell index">
                            <span class="song-number">2</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">汎用合成クラスメイト・宇佐見05号</span>
                                    <div class="song-tags">
                                        <span class="tag quality">135K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">めらみぽっぷ/滑叶櫻</div>
                        <div class="cell album">東方compilation CD 若葉箱</div>
                        <div class="cell duration">04:21</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>

                    <div class="song-item" data-song="3">
                        <div class="cell index">
                            <span class="song-number">3</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">トライアングル</span>
                                    <div class="song-tags">
                                        <span class="tag quality">130K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">藤田麻衣子/美聖子</div>
                        <div class="cell album">wish～キボウ～</div>
                        <div class="cell duration">05:12</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>

                    <div class="song-item" data-song="4">
                        <div class="cell index">
                            <span class="song-number">4</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">青い空のカミュ full</span>
                                    <div class="song-tags">
                                        <span class="tag quality">146K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">神月はるか/BLUE DOOR RECORD</div>
                        <div class="cell album">青い空のカミュ Original Soundtrack</div>
                        <div class="cell duration">04:33</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    getEmptyPageContent(pageType) {
        return `
            <section class="empty-page">
                <div class="empty-content">
                    <h2 class="page-title">${pageType}</h2>
                    <p class="page-subtitle">该页面内容正在开发中...</p>
                </div>
            </section>
        `;
    }
    
    animateNavSwitch(item) {
        // 侧边滑动效果，不修改背景色，让CSS的active样式生效
        item.style.transform = 'translateX(8px)';
        
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    }
    
    showContextMenu(event) {
        event.preventDefault();
        const contextMenu = document.getElementById('contextMenu');
        
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.classList.add('show');
        
        // 出现动画
        setTimeout(() => {
            contextMenu.style.transform = 'scale(1)';
            contextMenu.style.opacity = '1';
        }, 10);
    }
    
    hideContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.classList.remove('show');
    }
    
    animateSearchFocus() {
        const searchContainer = document.querySelector('.search-container');
        searchContainer.style.transform = 'scale(1.02)';
    }
    
    animateSearchBlur() {
        const searchContainer = document.querySelector('.search-container');
        searchContainer.style.transform = '';
    }
    
    handleKeyboard(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.previousSong();
                break;
            case 'ArrowRight':
                this.nextSong();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.volume = Math.min(1, this.volume + 0.1);
                this.updateVolumeDisplay();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.volume = Math.max(0, this.volume - 0.1);
                this.updateVolumeDisplay();
                break;
            case 'KeyM':
                this.volume = this.volume === 0 ? 0.7 : 0;
                this.updateVolumeDisplay();
                break;
        }
    }
    
    handleResize() {
        // 响应式布局调整
        const width = window.innerWidth;
        const sidebar = document.querySelector('.sidebar');
        
        if (width < 768) {
            sidebar.style.transform = 'translateX(-100%)';
        } else {
            sidebar.style.transform = '';
        }
    }
    
    updateProgress() {
        if (this.isPlaying) {
            this.currentTime += 1;
            if (this.currentTime >= this.totalTime) {
                this.currentTime = 0;
                this.nextSong();
            }
        }
        
        this.updateProgressBar();
        this.updateTimeDisplay();
        
        setTimeout(() => this.updateProgress(), 1000);
    }
    
    updateProgressBar() {
        const percentage = (this.currentTime / this.totalTime) * 100;
        const progressFill = document.querySelector('.progress-fill');
        const progressHandle = document.querySelector('.progress-handle');
        
        progressFill.style.width = `${percentage}%`;
        progressHandle.style.left = `${percentage}%`;
    }
    
    updateTimeDisplay() {
        const currentTimeEl = document.querySelector('.current-time');
        const totalTimeEl = document.querySelector('.total-time');
        
        currentTimeEl.textContent = this.formatTime(this.currentTime);
        totalTimeEl.textContent = this.formatTime(this.totalTime);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    startAnimations() {
        // 启动页面加载动画
        this.animatePageLoad();
        
        // 启动背景粒子效果
        this.initParticleBackground();
    }
    
    animatePageLoad() {
        const elements = [
            '.sidebar',
            '.hero-banner',
            '.action-bar',
            '.song-list',
            '.player-bar'
        ];
        
        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }
    
    initParticleBackground() {
        // 创建背景粒子效果（可选）
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        
        document.body.appendChild(canvas);
        
        // 这里可以添加 Canvas 粒子动画逻辑
    }
    
    createRippleEffect(element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(108, 160, 220, 0.3);
            width: ${size}px;
            height: ${size}px;
            left: ${event.clientX - rect.left - size / 2}px;
            top: ${event.clientY - rect.top - size / 2}px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                element.removeChild(ripple);
            }
        }, 600);
    }
    
    playAll() {
        console.log('播放全部歌曲');
        // 这里可以添加播放全部歌曲的逻辑
        this.playSong(1);
    }
    
    shufflePlay() {
        console.log('随机播放');
        // 这里可以添加随机播放的逻辑
        const randomSong = Math.floor(Math.random() * 4) + 1;
        this.playSong(randomSong);
    }
    
    switchPage(clickedItem) {
        // 移除所有导航项的激活状态
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        // 设置点击项为激活状态
        clickedItem.classList.add('active');
        
        // 获取页面类型
        const pageText = clickedItem.querySelector('span').textContent.trim();
        const contentArea = document.querySelector('.content-area');
        
        // 更新标题栏
        const currentSongTitle = document.querySelector('.current-song-title');
        currentSongTitle.textContent = pageText;
        
        // 根据页面类型切换内容
        switch(pageText) {
            case '推荐':
                this.showRecommendationPage(contentArea);
                break;
            case '歌曲':
                this.showSongListPage(contentArea);
                break;
            case '专辑':
                this.showAlbumPage(contentArea);
                break;
            case '歌手':
                this.showArtistPage(contentArea);
                break;
            case '我的歌单':
                this.showPlaylistPage(contentArea);
                break;
            default:
                this.showEmptyPage(contentArea, pageText);
                break;
        }
        
        // 页面切换动画
        this.animatePageTransition(contentArea);
    }
    
    showRecommendationPage(contentArea) {
        contentArea.className = 'content-area recommendation-page';
        contentArea.innerHTML = `
            <!-- 每日推荐区域 -->
            <section class="daily-recommendations">
                <div class="section-header">
                    <h2 class="section-title-large">每日推荐</h2>
                    <a href="#" class="view-more-link">查看更多</a>
                </div>
                
                <div class="recommendation-grid">
                    <div class="recommendation-card">
                        <div class="card-content">
                            <div class="song-info">
                                <h3 class="song-title">Letting Go</h3>
                                <p class="song-artist">刘大壮 - Letting Go</p>
                            </div>
                            <button class="card-play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="card-content">
                            <div class="song-info">
                                <h3 class="song-title">MUIMI</h3>
                                <p class="song-artist">ササノマリイ - MUIMI</p>
                            </div>
                            <button class="card-play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="card-content">
                            <div class="song-info">
                                <h3 class="song-title">whoa (mind in awe)</h3>
                                <p class="song-artist">XXXTENTACION - SKINS</p>
                            </div>
                            <button class="card-play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="card-content">
                            <div class="song-info">
                                <h3 class="song-title">We Can Dance in the Dark</h3>
                                <p class="song-artist">Nao'ymt - We Can Dance in the Dark</p>
                            </div>
                            <button class="card-play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="card-content">
                            <div class="song-info">
                                <h3 class="song-title">chAngE</h3>
                                <p class="song-artist">miwa - chAngE</p>
                            </div>
                            <button class="card-play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="card-content">
                            <div class="song-info">
                                <h3 class="song-title">10,000 Hours</h3>
                                <p class="song-artist">Dan + Shay/Justin Bieber - 10,000 Hours</p>
                            </div>
                            <button class="card-play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 最近播放区域 -->
            <section class="recent-played">
                <div class="section-header">
                    <h2 class="section-title-large">最近播放</h2>
                </div>
                
                <div class="recent-albums-grid">
                    <div class="album-card">
                        <div class="album-cover">
                            <div class="album-placeholder" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                            <div class="album-overlay">
                                <button class="album-play-btn">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">hectopascal</h4>
                            <p class="album-artist">寿美菜子/高田憂希</p>
                        </div>
                    </div>
                    
                    <div class="album-card">
                        <div class="album-cover">
                            <div class="album-placeholder" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
                            <div class="album-overlay">
                                <button class="album-play-btn">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">若生命等候</h4>
                            <p class="album-artist">黄明升</p>
                        </div>
                    </div>
                    
                    <div class="album-card">
                        <div class="album-cover">
                            <div class="album-placeholder" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
                            <div class="album-overlay">
                                <button class="album-play-btn">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">莫斯科別為我...</h4>
                            <p class="album-artist">黄金玉米王</p>
                        </div>
                    </div>
                    
                    <div class="album-card">
                        <div class="album-cover">
                            <div class="album-placeholder" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);"></div>
                            <div class="album-overlay">
                                <button class="album-play-btn">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">免我蹉跎苦</h4>
                            <p class="album-artist">黄明</p>
                        </div>
                    </div>
                    
                    <div class="album-card">
                        <div class="album-cover">
                            <div class="album-placeholder" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);"></div>
                            <div class="album-overlay">
                                <button class="album-play-btn">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">入画江南</h4>
                            <p class="album-artist">黄明</p>
                        </div>
                    </div>
                    
                    <div class="album-card">
                        <div class="album-cover">
                            <div class="album-placeholder" style="background: linear-gradient(135deg, #96fbc4 0%, #f9f586 100%);"></div>
                            <div class="album-overlay">
                                <button class="album-play-btn">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">吸</h4>
                            <p class="album-artist">黄明/Tang Duy...</p>
                        </div>
                    </div>
                    
                    <div class="album-card">
                        <div class="album-cover">
                            <div class="album-placeholder" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);"></div>
                            <div class="album-overlay">
                                <button class="album-play-btn">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">千本樱</h4>
                            <p class="album-artist">黑うさ</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // 更新图标主题
        this.updatePlayerIconsTheme();
    }
    
    showSongListPage(contentArea) {
        contentArea.className = 'content-area';
        contentArea.innerHTML = `
            <!-- 横幅区域 -->
            <section class="hero-banner">
                <div class="banner-slide active">
                    <div class="banner-background">
                        <img src="assets/banner1.jpg" alt="Featured Music">
                    </div>
                    <div class="banner-content">
                        <h2 class="banner-title">全部音乐</h2>
                        <p class="banner-subtitle">发现你喜欢的音乐</p>
                        <button class="play-all-btn">
                            <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="btn-icon">
                            全部播放 (共3218首)
                        </button>
                    </div>
                </div>
            </section>

            <!-- 功能按钮区 -->
            <section class="action-bar">
                <div class="action-buttons">
                    <button class="action-btn primary">
                        <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="btn-icon">
                        播放全部
                    </button>
                    <button class="action-btn">
                        <img src="assets/Icons/playlist_shuffle_icon_227435_d.ico" alt="随机播放" class="btn-icon">
                        随机播放
                    </button>
                </div>
            </section>

            <!-- 歌曲列表 -->
            <section class="song-list">
                <div class="list-header">
                    <div class="header-cell index">#</div>
                    <div class="header-cell title">歌曲</div>
                    <div class="header-cell artist">艺术家</div>
                    <div class="header-cell album">专辑</div>
                    <div class="header-cell duration">时长</div>
                    <div class="header-cell actions"></div>
                </div>
                
                <div class="song-items">
                    <!-- 歌曲项目 -->
                    <div class="song-item playing" data-song="1">
                        <div class="cell index">
                            <span class="song-number">1</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">ゆめいろハナミズキ</span>
                                    <div class="song-tags">
                                        <span class="tag quality">182K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">東山奈央</div>
                        <div class="cell album">ゆめいろハナミズキ</div>
                        <div class="cell duration">03:57</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>

                    <div class="song-item" data-song="2">
                        <div class="cell index">
                            <span class="song-number">2</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">汎用合成クラスメイト・宇佐見05号</span>
                                    <div class="song-tags">
                                        <span class="tag quality">135K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">めらみぽっぷ/滑叶櫻</div>
                        <div class="cell album">東方compilation CD 若葉箱</div>
                        <div class="cell duration">04:21</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>

                    <div class="song-item" data-song="3">
                        <div class="cell index">
                            <span class="song-number">3</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">トライアングル</span>
                                    <div class="song-tags">
                                        <span class="tag quality">130K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">藤田麻衣子/美聖子</div>
                        <div class="cell album">wish～キボウ～</div>
                        <div class="cell duration">05:12</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>

                    <div class="song-item" data-song="4">
                        <div class="cell index">
                            <span class="song-number">4</span>
                            <button class="play-btn">
                                <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                            </button>
                        </div>
                        <div class="cell title">
                            <div class="song-info">
                                <div class="song-cover-placeholder"></div>
                                <div class="song-details">
                                    <span class="song-name">青い空のカミュ full</span>
                                    <div class="song-tags">
                                        <span class="tag quality">146K</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell artist">神月はるか/BLUE DOOR RECORD</div>
                        <div class="cell album">青い空のカミュ Original Soundtrack</div>
                        <div class="cell duration">04:33</div>
                        <div class="cell actions">
                            <button class="action-icon more">
                                <span class="more-icon">⋯</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // 重新绑定歌曲列表事件
        this.bindSongListEvents();
        // 更新图标主题
        this.updatePlayerIconsTheme();
    }
    
    showEmptyPage(contentArea, pageName) {
        contentArea.className = 'content-area';
        contentArea.innerHTML = `
            <div class="empty-page">
                <div class="empty-content">
                    <h2 class="page-title">${pageName}</h2>
                    <p class="page-subtitle">该页面内容正在开发中...</p>
                </div>
            </div>
        `;
    }
    
    showAlbumPage(contentArea) {
        contentArea.className = 'content-area album-page';
        contentArea.innerHTML = `
            <!-- 专辑搜索栏 -->
            <section class="album-search-section">
                <div class="album-search-container">
                    <img src="assets/Icons/music_icon_227430_d.ico" alt="搜索" class="album-search-icon">
                    <input type="text" placeholder="搜索专辑/歌手" class="album-search-input">
                    <button class="album-filter-btn">
                        <img src="assets/Icons/playlist_icon_227431_d.ico" alt="筛选" class="filter-icon">
                    </button>
                </div>
            </section>

            <!-- 专辑网格 -->
            <section class="albums-grid-section">
                <div class="albums-grid">
                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #FF4444 0%, #FFAA00 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">ゆめいろハナミズキ</h3>
                            <p class="album-artist">東山奈央</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">東方compilation CD</h3>
                            <p class="album-artist">めらみぽっぷ/滑叶櫻</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #FF8A80 0%, #FFCC02 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">wish～キボウ～</h3>
                            <p class="album-artist">藤田麻衣子/美聖子</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #FF5722 0%, #FFC107 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">青い空のカミュ OST</h3>
                            <p class="album-artist">神月はるか</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #E91E63 0%, #FF9800 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">for RITZ</h3>
                            <p class="album-artist">岡崎律子</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #D32F2F 0%, #FFA000 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">大牌遇见好声音</h3>
                            <p class="album-artist">黄明</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #C62828 0%, #FF8F00 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">所念皆星河</h3>
                            <p class="album-artist">DJ阿轩</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #B71C1C 0%, #FF6F00 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">倾往昔</h3>
                            <p class="album-artist">黄诗扶</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #AD1457 0%, #F57C00 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">怎么办我爱你</h3>
                            <p class="album-artist">花粥Hana</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #880E4F 0%, #EF6C00 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">Here I am part</h3>
                            <p class="album-artist">八神純子</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #4A148C 0%, #E65100 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">接受事与愿违</h3>
                            <p class="album-artist">萧潇</p>
                        </div>
                    </div>

                    <div class="album-item">
                        <div class="album-cover">
                            <div class="album-cover-gradient" style="background: linear-gradient(135deg, #311B92 0%, #D84315 100%);"></div>
                            <div class="album-hover-overlay">
                                <button class="album-play-button">
                                    <img src="assets/Icons/player_play_icon_227418_d.ico" alt="播放" class="play-icon">
                                </button>
                            </div>
                        </div>
                        <div class="album-text-info">
                            <h3 class="album-name">宝丽金劲爆</h3>
                            <p class="album-artist">陈雅美</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // 更新图标主题
        this.updatePlayerIconsTheme();
    }
    
    showArtistPage(contentArea) {
        this.showEmptyPage(contentArea, '歌手');
    }
    
    showPlaylistPage(contentArea) {
        this.showEmptyPage(contentArea, '我的歌单');
    }
    
    animatePageTransition(contentArea) {
        contentArea.style.opacity = '0';
        contentArea.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            contentArea.style.transition = 'all 0.3s ease-out';
            contentArea.style.opacity = '1';
            contentArea.style.transform = 'translateY(0)';
        }, 50);
        
        setTimeout(() => {
            contentArea.style.transition = '';
        }, 350);
    }
    
    bindSongListEvents() {
        // 重新绑定歌曲列表项点击事件
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => this.playSong(index + 1));
            item.addEventListener('contextmenu', (e) => this.showContextMenu(e));
        });
    }

    // ...existing code...
}

// 添加自定义 CSS 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes heartParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new SparklePlayerUI();
});
