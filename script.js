// Variables
let activeSection = 'home';
let isScrolling = false;

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeScrollHandler();
    initializeMobileMenu();
    initializeContactForm();
    initializeAnimations();
});

// Navigation Functions
function initializeNavigation() {
    // Set initial active state
    updateActiveNavLink('home');

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('data-section');
            scrollToSection(section);
        });
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = header.offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;

        // Smooth scroll
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });

        // Update active section
        activeSection = sectionId;
        updateActiveNavLink(sectionId);

        // Close mobile menu if open
        closeMobileMenu();
    }
}

function updateActiveNavLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Scroll Handler
function initializeScrollHandler() {
    let ticking = false;

    function updateScrollPosition() {
        if (!isScrolling) {
            handleScroll();
        }
        ticking = false;
    }

    function handleScroll() {
        const scrollPosition = window.scrollY + 100;
        const sections = ['home', 'about', 'blog', 'contact'];

        // Update header background on scroll
        if (window.scrollY > 10) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.8)';
            header.style.backdropFilter = 'blur(12px)';
        }

        // Find current section
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const offsetTop = element.offsetTop;
                const offsetBottom = offsetTop + element.offsetHeight;

                if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                    if (activeSection !== section) {
                        activeSection = section;
                        updateActiveNavLink(section);
                    }
                    break;
                }
            }
        }
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });
}

// Mobile Menu Functions
function initializeMobileMenu() {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on mobile nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.textContent.toLowerCase().replace(' ', '');
            const sectionMap = {
                'home': 'home',
                'aboutme': 'about',
                'blog': 'blog',
                'contact': 'contact'
            };
            scrollToSection(sectionMap[section] || section);
        });
    });
}

function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');

    if (mobileNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    mobileNav.classList.remove('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// Contact Form
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    fetch('save_message.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        const notification = document.getElementById('notification');

        if (data.includes("✅")) {
            notification.innerHTML = `<div class="success">${data}</div>`;
            contactForm.reset();
        } else {
            notification.innerHTML = `<div class="error">${data}</div>`;
        }
    })
    .catch(err => {
        const notification = document.getElementById('notification');
        notification.innerHTML = `<div class="error">Lỗi kết nối, vui lòng thử lại sau.</div>`;
        console.error(err);
    });
}



// Animations and Effects
function initializeAnimations() {
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe elements for animations
    const animateElements = document.querySelectorAll('.project-card, .blog-card, .skill-card, .about-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class=\"notification-content\">
            <i class=\"fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}\"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#3B82F6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Project and Blog interactions
function initializeCardInteractions() {
    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                showNotification(`Opening ${title} details...`, 'info');
            });
        }

        const actionBtns = card.querySelectorAll('.action-btn, .link-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isGithub = btn.querySelector('.fa-github');
                const action = isGithub ? 'GitHub repository' : 'live demo';
                showNotification(`Opening ${action}...`, 'info');
            });
        });
    });

    // Blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            showNotification(`Opening article: ${title}`, 'info');
        });

        const readMoreBtn = card.querySelector('.read-more');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = card.querySelector('h3').textContent;
                showNotification(`Reading: ${title}`, 'info');
            });
        }
    });
}

// Button interactions
function initializeButtonInteractions() {
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-primary-large, .btn-outline-large');
    ctaButtons.forEach(btn => {
        if (!btn.onclick && btn.textContent.includes('View All')) {
            btn.addEventListener('click', () => {
                if (btn.textContent.includes('Projects')) {
                    showNotification('Loading all projects...', 'info');
                } else if (btn.textContent.includes('Articles')) {
                    showNotification('Loading all articles...', 'info');
                }
            });
        }
    });

// Social links
const socialLinks = document.querySelectorAll('.social-link, .social-card, .footer-social-link');
socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const platform = link.querySelector('i').className;
        let platformName = 'social media';

        if (platform.includes('leetcode')) platformName = 'leetcode';
        else if (platform.includes('facebook')) platformName = 'facebook';
        else if (platform.includes('envelope') || platform.includes('mail')) platformName = 'Email';
        else if (platform.includes('twitter')) platformName = 'Twitter';

        showNotification(`Opening ${platformName}...`, 'info');

        // Mở link sau khi thông báo
        const url = link.href;
        if(url) {
            window.open(url, '_blank'); // mở link ra tab mới
        }
    });
});


    // Contact info links
    const contactLinks = document.querySelectorAll('.contact-item[href]');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href.startsWith('mailto:')) {
                showNotification('Opening email client...', 'info');
            } else if (link.href.startsWith('tel:')) {
                showNotification('Opening phone dialer...', 'info');
            }
        });
    });
}

// Initialize all interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        initializeCardInteractions();
        initializeButtonInteractions();
    }, 500);
});

// Smooth scroll behavior for older browsers
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Pause animations when page is not visible
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page becomes visible
        console.log('Page visible - resuming animations');
    }
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Add keyboard navigation support
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }

    // Navigate sections with arrow keys
    if (e.altKey) {
        const sections = ['home', 'about', 'blog', 'contact'];
        const currentIndex = sections.indexOf(activeSection);

        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            scrollToSection(sections[currentIndex + 1]);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            scrollToSection(sections[currentIndex - 1]);
        }
    }
});

// Add resize handler for responsive adjustments
window.addEventListener('resize', function () {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Performance monitoring
if ('requestIdleCallback' in window) {
    requestIdleCallback(function () {
        console.log('Page loaded and idle - all optimizations complete');
    });
}

// Export functions for external use
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;


// Blog data mẫu
const blogData = {
    'JavaBasic': {
        title: 'Java Basics: Những Khái Niệm Nền Tảng',
        category: 'Java',
        date: 'October 3, 2025',
        readTime: '8 min read',
        image: 'images/JavaBasics1.jpg',
        content: `
            <h2>Giới thiệu: Sức Mạnh của Java</h2>
            <p>Chào mừng bạn đến với Java, một trong những ngôn ngữ lập trình <span>phổ biến nhất thế giới</span>! Java nổi tiếng là ngôn ngữ hướng đối tượng, mạnh mẽ, và có tính bảo mật cao, được ứng dụng rộng rãi trong phát triển ứng dụng di động (Android), ứng dụng doanh nghiệp (Enterprise), và hệ thống Backend quy mô lớn. Bài viết này sẽ giúp bạn nắm vững những khái niệm cơ bản nhất để bắt đầu hành trình lập trình của mình.</p>

            <h2>1. Biến và Kiểu Dữ Liệu</h2>
            <p>Trong Java, mọi dữ liệu bạn lưu trữ đều phải được khai báo với một <span>kiểu dữ liệu (Data Type)</span> cụ thể. Đây là điểm mấu chốt giúp Java trở nên mạnh mẽ và ít lỗi hơn. Kiểu dữ liệu sẽ xác định kích thước và loại giá trị mà biến đó có thể chứa.</p>
            <img src='images/JavaBasicsVar1.png'>
            <p>Các kiểu dữ liệu <span>nguyên thủy (Primitive Types)</span> cơ bản bạn cần biết:</p>
            <ul>
            <li><strong><code>int</code></strong>: Kiểu số nguyên (không có phần thập phân). Dùng cho các giá trị như tuổi, số lượng sản phẩm.</li>
            <li><strong><code>double</code></strong>: Kiểu số thực (có phần thập phân). Thường dùng cho giá trị tiền tệ, đo lường chính xác.</li>
            <li><strong><code>boolean</code></strong>: Chỉ chứa <code>true</code> hoặc <code>false</code>. Quan trọng cho các câu lệnh điều kiện.</li>
            <li><strong><code>char</code></strong>: Chỉ chứa một ký tự đơn, được đặt trong dấu nháy đơn (<code>'a'</code>).</li>
            <li><strong><code>String</code></strong>: Kiểu dữ liệu <span>không nguyên thủy</span> (Object) dùng để lưu chuỗi ký tự, được đặt trong dấu nháy kép (<code>"Xin Chào"</code>).</li>
            </ul>
            <p><strong>Ví dụ Khai Báo và Khởi Tạo Biến:</strong> Khi khai báo, bạn phải chỉ rõ kiểu dữ liệu trước tên biến. Ví dụ dưới đây minh họa cách gán giá trị cho các biến đã khai báo.</p>
            <img src='images/JavaBasicsVar2.png'>

            <h2>2. Toán Tử (Operators)</h2>
            <p>Toán tử là các ký hiệu dùng để thực hiện các phép tính hoặc so sánh trên các biến và giá trị. Java hỗ trợ ba nhóm toán tử chính:</p>
            <ul>
            <li><strong>Toán tử Số học:</strong> <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code> (chia lấy dư). Dùng trong các phép tính cơ bản.</li>
            <li><strong>Toán tử So sánh:</strong> <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> (trả về kết quả <code>boolean</code>).</li>
            <li><strong>Toán tử Logic:</strong> <code>&&</code> (AND), <code>||</code> (OR), <code>!</code> (NOT). Dùng để kết hợp nhiều điều kiện so sánh.</li>
            </ul>
            <p><strong>Ví dụ Sử dụng Toán tử Logic:</strong> Trong ví dụ sau, biểu thức logic kết hợp <code>(a &gt; b) && (b &lt; 10)</code> sẽ trả về <code>true</code> vì cả hai điều kiện đều đúng.</p>
            <img src='images/JavaBasicsVar3.png'>

            <h2>3. Vòng Lặp (Loops)</h2>
            <p>Vòng lặp là công cụ thiết yếu để <span>tự động hóa các tác vụ lặp đi lặp lại</span>. Thay vì viết cùng một đoạn code nhiều lần, bạn chỉ cần đặt nó vào một vòng lặp và chỉ định điều kiện dừng.</p>
            <ul>
            <li><strong><code>for</code></strong>: Dùng khi bạn biết trước số lần lặp cụ thể. Phổ biến nhất.</li>
            <li><strong><code>while</code></strong>: Lặp lại một khối code <span>chừng nào điều kiện còn đúng</span>. Cần cẩn thận để tránh vòng lặp vô tận.</li>
            <li><strong><code>do-while</code></strong>: Khối code sẽ được thực thi <span>ít nhất một lần</span>, sau đó mới kiểm tra điều kiện để quyết định lặp tiếp hay không.</li>
            </ul>
            <p><strong>Ví dụ Vòng lặp <code>for</code>:</strong> Đoạn code này minh họa cách dùng vòng lặp <code>for</code> để thực thi lệnh in 5 lần.</p>
            <img src='images/JavaBasicsVar4.png'>

            <h2>4. Câu Lệnh Điều Kiện (Conditional Statements)</h2>
            <p>Để chương trình đưa ra quyết định, chúng ta sử dụng câu lệnh điều kiện. Java dùng <strong><code>if-else</code></strong> để thực hiện một khối code <span>chỉ khi một điều kiện cụ thể là <code>true</code></span>.</p>
            <ul>
            <li><strong><code>if</code></strong>: Thực thi khối code nếu điều kiện là <code>true</code>.</li>
            <li><strong><code>else if</code></strong>: Kiểm tra điều kiện thứ hai nếu điều kiện <code>if</code> ban đầu là <code>false</code>.</li>
            <li><strong><code>else</code></strong>: Thực thi khối code mặc định nếu tất cả các điều kiện trên đều <code>false</code>.</li>
            </ul>
            <img src='images/JavaBasicsVar5.png'>

            <h2>5. Hàm / Method</h2>
            <p>Hàm (hay Method trong Java) là một khối code được đặt tên, được dùng để thực hiện một tác vụ cụ thể. Method giúp <span>tái sử dụng code</span> và làm cho chương trình trở nên có cấu trúc, dễ đọc và dễ bảo trì hơn. Hàm <code>main</code> là hàm bắt buộc, nơi chương trình Java bắt đầu thực thi.</p>
            <img src='images/JavaBasicsVar6.png'>

            <h2>Kết Luận và Luyện Tập</h2>
            <p>Những kiến thức cơ bản về biến, toán tử, vòng lặp, điều kiện và hàm là <span>nền tảng vững chắc</span> cho mọi lập trình viên Java. Để thành thạo, bạn hãy thử viết các chương trình nhỏ:</p>
            <ul>
            <li>Viết chương trình tính diện tích hình tròn (dùng <code>double</code>).</li>
            <li>Viết vòng lặp in ra tất cả các số chẵn từ 1 đến 20.</li>
            <li>Viết hàm kiểm tra xem một số có phải là số dương hay không (dùng <code>boolean</code>).</li>
            </ul>
            <p>Bắt tay vào code ngay hôm nay và đừng ngại thử nghiệm! Chúc bạn học tốt! 🚀</p>
        `
    },
    'OOP': {
        title: 'OOP - Object Oriented Programming',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '12 min read',
        image: 'images/OOP1.png',
        content: `
            <h2>Giới thiệu</h2>
            <p>Lập trình hướng đối tượng (OOP) là phương pháp tổ chức code thành các đối tượng, giúp dễ quản lý, mở rộng và tái sử dụng. Java là ngôn ngữ hướng đối tượng hoàn toàn, nên hiểu OOP là điều cần thiết.</p>

            <h2>Class và Object</h2>
            <p>Class là khuôn mẫu để tạo đối tượng (object). Object là thực thể của class.</p>
            <p>Ví dụ:</p>
            <img src='images/OOP2.png'>

            <h2>Encapsulation (Đóng gói)</h2>
            <p>Ẩn dữ liệu bằng <strong>private</strong> và cung cấp <strong>getter/setter</strong> để truy cập.</p>
            <img src='images/OOP3.png'>

            <h2>Inheritance (Kế thừa)</h2>
            <p>Class con kế thừa class cha bằng từ khóa <strong>extends</strong>, giúp tái sử dụng code.</p>
            <img src='images/Inheritance1.png'>

            <h2>Polymorphism (Đa hình)</h2>
            <p>Cho phép dùng một phương thức với nhiều dạng khác nhau, ví dụ <strong>overloading</strong> và <strong>overriding</strong>.</p>
            <pre>
            class Calculator {
                int sum(int a, int b) { return a + b; }
                double sum(double a, double b) { return a + b; }
            }
            </pre>

            <h2>Abstraction (Trừu tượng)</h2>
            <p>Ẩn chi tiết thực hiện, chỉ cung cấp giao diện. Dùng <strong>abstract class</strong> hoặc <strong>interface</strong>.</p>
            <pre>
            abstract class Shape {
                abstract void draw();
            }

            class Circle extends Shape {
                void draw() { System.out.println("Drawing circle"); }
            }
            </pre>

            <h2>Kết luận</h2>
            <p>Hiểu rõ OOP giúp bạn tổ chức code gọn gàng, dễ bảo trì và mở rộng. Các nguyên tắc chính cần nhớ: Class/Object, Encapsulation, Inheritance, Polymorphism và Abstraction.</p>
        `
    },
    'Collections Framework': {
        title: 'Collections Framework',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/Collections Framework.png',
        content: `
            <h2>Giới thiệu</h2>
            <p>Collections Framework trong Java cung cấp các cấu trúc dữ liệu như List, Set, Map để lưu trữ, truy xuất và xử lý dữ liệu một cách linh hoạt và hiệu quả. Đây là phần quan trọng để viết code gọn gàng và dễ bảo trì.</p>

            <h2>List</h2>
            <p>List là tập hợp các phần tử có thứ tự, có thể chứa trùng lặp.</p>
            <p>Ví dụ ArrayList:</p>
            <pre>
            import java.util.ArrayList;

            ArrayList<String> names = new ArrayList<>();
            names.add("Duy");
            names.add("An");
            names.add("Lan");
            System.out.println(names.get(0)); // Duy
            </pre>

            <h2>Set</h2>
            <p>Set là tập hợp không có phần tử trùng lặp, không có thứ tự cố định.</p>
            <pre>
            import java.util.HashSet;

            HashSet<Integer> numbers = new HashSet<>();
            numbers.add(10);
            numbers.add(20);
            numbers.add(10); // trùng sẽ bị bỏ qua
            System.out.println(numbers);
            </pre>

            <h2>Map</h2>
            <p>Map lưu trữ dữ liệu dưới dạng key-value, key là duy nhất.</p>
            <pre>
            import java.util.HashMap;

            HashMap<String, Integer> scores = new HashMap<>();
            scores.put("Duy", 95);
            scores.put("An", 88);
            System.out.println(scores.get("Duy")); // 95
            </pre>

            <h2>Iterator</h2>
            <p>Iterator giúp duyệt qua các phần tử của Collection:</p>
            <pre>
            import java.util.ArrayList;
            import java.util.Iterator;

            ArrayList<String> list = new ArrayList<>();
            list.add("A");
            list.add("B");
            Iterator<String> it = list.iterator();
            while(it.hasNext()) {
                System.out.println(it.next());
            }
            </pre>

            <h2>Kết luận</h2>
            <p>Collections Framework là công cụ cực kỳ mạnh mẽ trong Java. Nắm rõ List, Set, Map và cách duyệt qua các phần tử giúp bạn xử lý dữ liệu nhanh chóng và viết code rõ ràng, dễ bảo trì.</p>
        `
    },
    'leetcode': {
        title: 'LeetCode - Hành trình từ Zero đến Hero',
        category: 'Experience',
        date: 'October 3, 2025',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop',
        content: `
            <h2>Giới thiệu</h2>
            <p>Lý do mình bắt đầu học LeetCode là muốn cải thiện kỹ năng code, thích giải đố và có một người chú làm trong lĩnh vực AI khuyên nhủ. Ban đầu mình khá bỡ ngỡ và có phần lo lắng.</p>
            
            <h2>Khởi đầu</h2>
            <p>Những ngày đầu rất khó khăn: chưa quen cách đọc đề, vốn tiếng Anh hạn chế và chưa biết đến các dạng form chuẩn. Ngay cả những bài <strong>Easy</strong> như <em>Two Sum</em>, <em>Valid Parentheses</em> cũng làm mình tốn nhiều thời gian.</p>
            <img src='images/LeetCode1.png' alt='Quá trình luyện tập' style='width: 100%; border-radius: 8px; margin: 16px 0;'>
            
            <h2>Quá trình luyện tập</h2>
            <p>Mỗi ngày mình đặt mục tiêu giải ít nhất 1 bài. Khi có thời gian rảnh và tinh thần thoải mái hơn, mình có thể làm từ 4–6 bài. Ngoài ra, mình thường xuyên dành thời gian để <strong>review lại code</strong>. Những chủ đề cơ bản mình học ban đầu gồm: <strong>Array</strong>, <strong>HashMap</strong>, <strong>Two Pointers</strong>, và <strong>Linked List</strong>.</p>
            
            <h2>Khó khăn và cách vượt qua</h2>
            <p>Ban đầu rất khó để duy trì thói quen luyện tập, nhiều lúc cảm thấy nản và phải xem code mẫu của người khác hoặc dùng các công cụ hỗ trợ. Cách mình vượt qua là xem lời giải mẫu rồi tự viết lại theo cách hiểu của mình, sau đó làm thêm các bài tương tự trong cùng chủ đề. Quan trọng nhất là giữ vững tinh thần, không bỏ cuộc: mỗi ngày cố gắng giải hoặc review ít nhất một bài.</p>
            
            <h2>Thành quả</h2>
            <p>Sau khoảng 1 tháng, mình đã giải được hơn 40 bài Easy và có thể làm được 1–2 bài Medium. Sau khoảng 100 bài Easy, mình bắt đầu giải Medium tự tin hơn, và đến khi giải được 140 bài Easy thì chuyển hẳn sang Medium. Đến nay, mình đã giải hơn 100 bài Medium. Việc luyện tập trên LeetCode giúp mình nâng cao tư duy thuật toán, hiểu bài học trên lớp dễ hơn và không còn lúng túng khi xem các video phỏng vấn giải thuật.</p>
            
            <img src='images/LeetCode2.png' alt='Thành quả học tập' style='width: 100%; border-radius: 8px; margin: 16px 0;'>
            
            <h2>Lời khuyên cho người mới</h2>
            <p>Điều quan trọng nhất là <strong>không bỏ cuộc</strong>. Hãy coi mỗi bài giải được là một niềm vui nhỏ. Cảm giác thành tựu sẽ tiếp thêm động lực để bạn đi xa hơn. Khi nhìn lại, bạn sẽ bất ngờ vì chặng đường mình đã đi qua.</p>
            
            <h2>Kết luận</h2>
            <p>Tóm lại, hành trình luyện tập trên LeetCode không dễ dàng nhưng rất đáng giá. Chỉ cần kiên trì và giữ thói quen mỗi ngày, bạn sẽ đạt được tiến bộ đáng kể.</p>
        `
    },
    'hanwhalife': {
        title: 'HanwhaLife Financial Mentor - Hành trình khám phá tài chính',
        category: 'Experience',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/HL1.jpg',
        content: `
            <h2>Giới thiệu</h2>
            <p>Mình tham gia chương trình <strong>HanwhaLife Financial Mentor</strong> vì cơ hội nhận học bổng bằng tiền mặt và đặc biệt là phần thưởng hấp dẫn – một chuyến đi trải nghiệm tại Hàn Quốc. Đây cũng là cơ hội hiếm có để mở rộng tầm nhìn về ngành tài chính – bảo hiểm và kết nối với nhiều bạn trẻ có cùng đam mê.</p>
            
            <img src='images/HL4.png' alt='HanwhaLife Program' style='width: 100%; border-radius: 8px; margin: 16px 0;'>
            
            <h2>Kỳ vọng và Ấn tượng ban đầu</h2>
            <p>Ngay từ đầu, mình đã kỳ vọng có thể giành được suất học bổng giá trị và mong muốn được đặt chân ra nước ngoài lần đầu tiên. Ấn tượng ban đầu về chương trình là sự chuyên nghiệp, quy mô và tính cạnh tranh khá cao, khiến mình vừa hào hứng vừa hồi hộp.</p>
            
            <h2>Quá trình tham gia</h2>
            <p>Để tiến xa trong chương trình, mình phải trải qua nhiều vòng xét duyệt: từ kiểm tra <strong>GPA</strong>, phỏng vấn tiếng Anh, cho đến kiểm tra kiến thức tài chính. Mỗi vòng đều mang đến thách thức mới, đòi hỏi sự chuẩn bị kỹ càng và tinh thần bền bỉ. Mình đã phải học hỏi thêm về đầu tư, bảo hiểm và cả cách quản lý tài chính cá nhân.</p>
            
            <img src='images/HL2.png' alt='Financial Learning' style='width: 100%; height: 100vh; border-radius: 8px; margin: 16px 0;'>
            
            <h2>Khó khăn và Bài học</h2>
            <p>Một trong những khó khăn lớn nhất là làm việc cùng những người giỏi hơn mình. Ban đầu mình thấy áp lực và phải nỗ lực rất nhiều để bắt kịp tiến độ của mọi người. Thêm vào đó, kiến thức về tài chính của mình còn hạn chế nên phải dành nhiều thời gian tự học thêm.</p>
            <p>Nhưng chính nhờ vậy, mình học được cách <strong>làm việc nhóm hiệu quả</strong>, mở rộng hiểu biết về đầu tư, bảo hiểm và nhận thức rõ hơn về <strong>trách nhiệm xã hội</strong> của các doanh nghiệp. Đây là những bài học quý giá không chỉ cho chương trình mà còn cho hành trình phát triển bản thân sau này.</p>
            
            <h2>Thành quả</h2>
            <p>Dù chưa biết mình có được đặt chân đến Hàn Quốc hay không, nhưng việc đi đến gần cuối chặng đường của chương trình đã là một thành quả lớn. Mình đã nhận được một phần học bổng từ những vòng trước, gặp gỡ và kết nối được với nhiều người bạn mới, và quan trọng hơn là bản thân trưởng thành hơn qua mỗi thử thách.</p>
            
            <img src='images/HL3.png' alt='Achievement and Growth' style='width: 100%; border-radius: 8px; margin: 16px 0;'>
            
            <h2>Lời khuyên và Cảm nhận</h2>
            <p>Chương trình này thật sự là một thử thách không nhỏ, đặc biệt khi phải cân bằng giữa việc học ở trường và các hoạt động của chương trình. Mặc dù có đôi lúc chương trình gặp vấn đề như thay đổi lịch trình, mình vẫn cảm thấy may mắn vì đã tham gia. Hy vọng trong tương lai sẽ có thêm những cơ hội rõ ràng và ổn định hơn, và khi đó mình sẽ đủ trưởng thành để chinh phục chúng một cách trọn vẹn.</p>
        `
    },
    'API': {
        title: 'Streams API & Lambda – Map, Filter, Reduce, Lambda Expressions',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/Streams API & Lambda.png',
        content: `
            <h3>1. Streams API là gì?</h3>
            <p>Streams API trong Java (từ Java 8) cho phép thao tác dữ liệu theo kiểu lập trình hàm. Thay vì dùng vòng lặp truyền thống, bạn có thể dùng các phương thức như map(), filter(), reduce...</p>

            <h3>2. Lambda Expressions</h3>
            <p>Lambda là cách viết hàm ngắn gọn, thường dùng với Streams. Ví dụ:</p>
            <pre>
            List&lt;Integer&gt; nums = Arrays.asList(1, 2, 3, 4, 5);
            nums.forEach(n -&gt; System.out.println(n));
            </pre>

            <h3>3. Map</h3>
            <p>Dùng để biến đổi từng phần tử:</p>
            <pre>
            List&lt;Integer&gt; squared = nums.stream()
                .map(n -&gt; n * n)
                .collect(Collectors.toList());
            </pre>

            <h3>4. Filter</h3>
            <p>Lọc dữ liệu dựa trên điều kiện:</p>
            <pre>
            List&lt;Integer&gt; even = nums.stream()
                .filter(n -&gt; n % 2 == 0)
                .collect(Collectors.toList());
            </pre>

            <h3>5. Reduce</h3>
            <p>Gộp dữ liệu thành một giá trị duy nhất:</p>
            <pre>
            int sum = nums.stream()
                .reduce(0, (a, b) -&gt; a + b);
            </pre>

            <h3>6. Kết luận</h3>
            <p>Streams API kết hợp với Lambda expressions giúp code ngắn gọn, dễ đọc và dễ bảo trì hơn khi làm việc với collection dữ liệu trong Java.</p>
        `
    },
    'JS Basics': {
        title: 'JS Basics – Biến, hàm, vòng lặp, object, array',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/JS Basics.png',
        content: `
            <h2>Giới thiệu</h2>
            <p>JavaScript (JS) là ngôn ngữ lập trình phổ biến để xây dựng website tương tác. Bài viết này giới thiệu các khái niệm cơ bản nhất: biến, hàm, vòng lặp, object và array.</p>

            <h2>Biến (Variables)</h2>
            <p>Dùng để lưu trữ dữ liệu. Có 3 cách khai báo: <code>var</code>, <code>let</code>, <code>const</code>.</p>
            <pre>
            let name = 'Duy';
            const age = 20;
            var city = 'HCM';
            </pre>
            <p>let và const (ES6) được khuyến khích dùng thay cho var.</p>

            <h2>Hàm (Functions)</h2>
            <p>Hàm giúp tái sử dụng code.</p>
            <pre>
            function greet(name) {
            return 'Hello ' + name;
            }

            console.log(greet('Duy'));
            </pre>
            <p>Arrow function:</p>
            <pre>
            const add = (a, b) => a + b;
            console.log(add(2, 3)); // 5
            </pre>

            <h2>Vòng lặp (Loops)</h2>
            <p>Dùng để lặp nhiều lần một đoạn code.</p>
            <pre>
            for(let i = 0; i < 5; i++) {
            console.log(i);
            }
            </pre>
            <pre>
            let j = 0;
            while(j < 5) {
            console.log(j);
            j++;
            }
            </pre>

            <h2>Object</h2>
            <p>Object lưu trữ dữ liệu dạng key–value.</p>
            <pre>
            const person = {
            name: 'Duy',
            age: 20
            };
            console.log(person.name);
            </pre>

            <h2>Array</h2>
            <p>Array là danh sách phần tử, có thể chứa nhiều kiểu dữ liệu.</p>
            <pre>
            const numbers = [1, 2, 3, 4];
            console.log(numbers[0]); // 1
            </pre>
            <p>Một số hàm xử lý array phổ biến:</p>
            <pre>
            numbers.push(5); // thêm phần tử
            numbers.pop(); // xóa phần tử cuối
            numbers.forEach(n => console.log(n));
            </pre>

            <h2>Kết luận</h2>
            <p>Nắm vững các khái niệm cơ bản này sẽ giúp bạn dễ dàng học các chủ đề nâng cao hơn như DOM, event handling, async/await.</p>
        `
    },
    'Exception Handling': {
        title: 'Exception Handling - Xử lý ngoại lệ',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/Exception Handling.png',
        content: `
        <h2>Giới thiệu</h2>
        <p>Trong Java, khi chương trình gặp lỗi trong quá trình chạy, gọi là exception. Exception Handling giúp chương trình không bị dừng đột ngột và xử lý lỗi một cách an toàn.</p>

        <h2>Try – Catch</h2>
        <p>Cấu trúc cơ bản để bắt lỗi:</p>
        <pre>
        try {
            // đoạn code có thể gây lỗi
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Lỗi chia cho 0: " + e.getMessage());
        }
        </pre>

        <h2>Finally</h2>
        <p>Khối finally luôn được thực hiện, dù có exception hay không:</p>
        <pre>
        try {
            System.out.println("Thực hiện try");
        } catch(Exception e) {
            System.out.println("Có lỗi xảy ra");
        } finally {
            System.out.println("Luôn chạy finally");
        }
        </pre>

        <h2>Throw và Throws</h2>
        <p>Dùng throw để ném 1 exception, throws để khai báo method có thể ném exception:</p>
        <pre>
        public void checkAge(int age) throws IllegalArgumentException {
            if(age &lt; 18) {
                throw new IllegalArgumentException("Tuổi phải từ 18 trở lên");
            }
        }

        try {
            checkAge(15);
        } catch(IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        </pre>

        <h2>Các loại Exception phổ biến</h2>
        <ul>
        <li>ArithmeticException – lỗi toán học (chia cho 0)</li>
        <li>NullPointerException – tham chiếu null</li>
        <li>ArrayIndexOutOfBoundsException – truy xuất mảng ngoài phạm vi</li>
        <li>IOException – lỗi input/output</li>
        </ul>

        <h2>Kết luận</h2>
        <p>Exception Handling giúp chương trình Java ổn định, tránh crash khi gặp lỗi. Các công cụ chính gồm try-catch-finally, throw và throws. Việc nắm rõ exception phổ biến giúp debug nhanh hơn và viết code an toàn hơn.</p>
        `
    },

    'DOM Manipulation': {
        title: 'DOM Manipulation',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/DOM Manipulation.webp',
        content: `
        <h2>Giới thiệu</h2>
        <p>DOM (Document Object Model) là cấu trúc dữ liệu dạng cây đại diện cho toàn bộ nội dung của một trang web. Mỗi thẻ HTML như &lt;div&gt;, &lt;p&gt;, hình ảnh hoặc nút bấm đều là một nút (node) trong cây DOM.</p>
        <p>Bằng cách sử dụng JavaScript, lập trình viên có thể truy cập và thay đổi cây DOM để cập nhật nội dung, thêm hoặc xóa phần tử, và phản hồi các hành động của người dùng mà không cần tải lại trang.</p>

        <h2>querySelector</h2>
        <p>querySelector() cho phép chọn phần tử DOM đầu tiên khớp với bộ chọn CSS.</p>
        <pre>
        const title = document.querySelector('#main-title');
        console.log(title);

        const firstParagraph = document.querySelector('.intro');
        const button = document.querySelector('button');
        </pre>
        <p>Ta có thể chọn phần tử dựa vào id, class hoặc tên thẻ HTML.</p>

        <h2>Thay đổi nội dung với innerHTML và textContent</h2>
        <p>Sau khi đã chọn được phần tử DOM, có thể thay đổi nội dung bằng textContent hoặc innerHTML.</p>
        <pre>
        const title = document.querySelector('#main-title');
        title.textContent = 'Tiêu đề mới';
        </pre>
        <p>innerHTML cho phép chèn thêm HTML bên trong phần tử:</p>
        <pre>
        const container = document.querySelector('#container');
        container.innerHTML = '&lt;p&gt;Nội dung mới với &lt;strong&gt;HTML&lt;/strong&gt;&lt;/p&gt;';
        </pre>

        <h2>Event Listeners</h2>
        <p>Event listener cho phép lắng nghe và xử lý các sự kiện người dùng như click, nhập liệu, cuộn trang.</p>
        <pre>
        const button = document.querySelector('#myButton');
        button.addEventListener('click', function() {
        alert('Bạn vừa nhấn nút!');
        });
        </pre>
        <p>Có thể dùng hàm mũi tên (arrow function):</p>
        <pre>
        button.addEventListener('click', () => {
        console.log('Button clicked!');
        });
        </pre>

        <h2>Ví dụ kết hợp</h2>
        <pre>
        &lt;h1 id='main-title'&gt;Xin chào!&lt;/h1&gt;
        &lt;button id='changeBtn'&gt;Đổi tiêu đề&lt;/button&gt;
        &lt;script&gt;
        const title = document.querySelector('#main-title');
        const button = document.querySelector('#changeBtn');

        button.addEventListener('click', () => {
            title.textContent = 'Tiêu đề đã được thay đổi!';
        });
        &lt;/script&gt;
        </pre>
        <p>Khi người dùng nhấn nút, nội dung tiêu đề sẽ thay đổi mà không cần tải lại trang.</p>

        <h2>Lợi ích của DOM Manipulation</h2>
        <ul>
        <li>Tạo giao diện người dùng động và tương tác.</li>
        <li>Cải thiện trải nghiệm người dùng nhờ phản hồi tức thì.</li>
        <li>Giúp cập nhật nội dung trang mà không cần tải lại toàn bộ.</li>
        </ul>

        <h2>Kết luận</h2>
        <p>DOM Manipulation là kỹ năng nền tảng cho lập trình viên front-end. Thành thạo querySelector, innerHTML và event listeners sẽ giúp bạn xây dựng các trang web linh hoạt và thân thiện với người dùng.</p>
        `
    },
    'ES6': {
        title: 'ES6 Features – let/const, arrow functions, template literals, destructuring',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/ES6 Features.webp',
        content: `
        <h2>Giới thiệu</h2>
        <p>ECMAScript 2015 (ES6) là một bản nâng cấp lớn của JavaScript, mang lại nhiều cú pháp và tính năng mới, giúp code ngắn gọn, dễ đọc và hiện đại hơn. Các tính năng phổ biến nhất gồm: let/const, arrow functions, template literals và destructuring.</p>

        <h2>let và const</h2>
        <p>Trước ES6, JavaScript chỉ có var để khai báo biến. ES6 giới thiệu let và const, giúp quản lý phạm vi biến tốt hơn.</p>
        <pre>
        let x = 10;
        const y = 20;

        x = 15; // Hợp lệ
        // y = 25; // Lỗi, vì y là hằng số
        </pre>
        <p>let dùng để khai báo biến có thể thay đổi, const cho giá trị không thay đổi. Cả hai đều có phạm vi khối (block scope), an toàn hơn so với var.</p>

        <h2>Arrow Functions</h2>
        <p>Arrow function là cú pháp ngắn gọn hơn để viết hàm và tự động ràng buộc ngữ cảnh this.</p>
        <pre>
        // Cách viết cũ
        function add(a, b) {
        return a + b;
        }

        // Arrow function
        const add = (a, b) => a + b;
        console.log(add(2, 3)); // 5
        </pre>
        <p>Nếu hàm chỉ có một dòng trả về, có thể bỏ dấu {} và từ khóa return.</p>

        <h2>Template Literals</h2>
        <p>Template literals (chuỗi mẫu) sử dụng dấu backtick (\`) cho phép chèn biến và biểu thức dễ dàng với cú pháp \${…}.</p>
        <pre>
        const name = 'Duy';
        const age = 20;
        console.log(\`Tên tôi là \${name} và tôi \${age} tuổi.\`);
        </pre>
        <p>Template literals cũng hỗ trợ viết chuỗi nhiều dòng:</p>
        <pre>
        const text = \`Dòng 1
        Dòng 2
        Dòng 3\`;
        console.log(text);
        </pre>

        <h2>Destructuring</h2>
        <p>Destructuring cho phép trích xuất giá trị từ mảng hoặc object một cách gọn gàng.</p>
        <pre>
        // Với mảng
        const numbers = [1, 2, 3];
        const [a, b, c] = numbers;
        console.log(a, b, c); // 1 2 3

        // Với object
        const person = { name: 'Duy', age: 20 };
        const { name, age } = person;
        console.log(name, age); // Duy 20
        </pre>

        <h2>Ví dụ kết hợp</h2>
        <pre>
        const students = [
        { name: 'An', score: 8 },
        { name: 'Bình', score: 9 }
        ];

        students.forEach(({ name, score }) => {
        console.log(\`\${name} đạt \${score} điểm\`);
        });
        </pre>
        <p>Ví dụ trên kết hợp arrow functions, template literals và destructuring để viết code ngắn gọn và rõ ràng.</p>

        <h2>Kết luận</h2>
        <p>Việc làm chủ các tính năng ES6 sẽ giúp bạn viết code JavaScript hiện đại, dễ bảo trì và hiệu quả hơn. Đây là nền tảng quan trọng để tiếp cận các thư viện và framework như React, Vue hay Node.js.</p>
        `
    },
    'Async': {
        title: 'Async Programming – Callbacks, Promises, Async/Await, fetch API',
        category: 'Tutorial',
        date: 'October 3, 2025',
        readTime: '6 min read',
        image: 'images/Async Programming.webp',
        content: `

        <h2>Giới thiệu</h2> <p>Lập trình bất đồng bộ (Asynchronous Programming) trong JavaScript cho phép xử lý các tác vụ mất thời gian (như gọi API, đọc file, truy vấn cơ sở dữ liệu) mà không chặn luồng chính của ứng dụng. Điều này giúp website hoạt động mượt mà và phản hồi tốt hơn.</p> <h2>Callbacks</h2> <p>Callback là một hàm được truyền vào hàm khác và sẽ được gọi sau khi tác vụ hoàn tất. Đây là cách tiếp cận truyền thống để xử lý bất đồng bộ.</p> <pre> function fetchData(callback) { console.log('Đang tải dữ liệu...'); setTimeout(() => { callback('Dữ liệu đã tải xong'); }, 2000); }

        fetchData(result => {
        console.log(result);
        });
        </pre>

        <p>Nhược điểm của callbacks là dễ dẫn đến callback hell khi có nhiều tác vụ nối tiếp nhau.</p> <h2>Promises</h2> <p>Promise là một đối tượng đại diện cho kết quả của một thao tác bất đồng bộ (có thể hoàn thành hoặc thất bại). Promise giúp viết code dễ đọc và dễ quản lý hơn.</p> <pre> function fetchData() { return new Promise((resolve, reject) => { setTimeout(() => { resolve('Dữ liệu đã tải xong'); }, 2000); }); }

        fetchData()
        .then(result => console.log(result))
        .catch(error => console.error(error));
        </pre>

        <p>Phương thức .then() được gọi khi Promise thành công, .catch() xử lý lỗi.</p> <h2>Async/Await</h2> <p>Async/Await được giới thiệu từ ES2017 giúp code bất đồng bộ trông giống code đồng bộ, dễ đọc hơn.</p> <pre> function fetchData() { return new Promise(resolve => { setTimeout(() => { resolve('Dữ liệu đã tải xong'); }, 2000); }); }

        async function getData() {
        console.log('Bắt đầu tải...');
        const result = await fetchData();
        console.log(result);
        }

        getData();
        </pre>

        <p>Từ khóa await chỉ dùng bên trong hàm được khai báo với async, giúp dừng hàm cho đến khi Promise được giải quyết.</p> <h2>fetch API</h2> <p>fetch là hàm tích hợp trong JavaScript dùng để gửi yêu cầu HTTP một cách dễ dàng và trả về một Promise.</p> <pre> async function fetchUsers() { try { const response = await fetch('https://jsonplaceholder.typicode.com/users'); const data = await response.json(); console.log(data); } catch (error) { console.error('Lỗi:', error); } }

        fetchUsers();
        </pre>

        <p>Với fetch và async/await, ta có thể viết code gọi API ngắn gọn, rõ ràng và dễ bảo trì.</p> <h2>So sánh</h2> <ul> <li>Callbacks: Dễ hiểu nhưng nhanh chóng trở nên khó quản lý khi nhiều tác vụ nối tiếp.</li> <li>Promises: Tổ chức tốt hơn, tránh callback hell.</li> <li>Async/Await: Cú pháp gọn gàng, dễ đọc, đặc biệt hữu ích cho các tác vụ nối tiếp.</li> </ul> <h2>Kết luận</h2> <p>Hiểu và làm chủ các cơ chế bất đồng bộ là chìa khóa để xây dựng các ứng dụng web hiện đại, tối ưu trải nghiệm người dùng và hiệu năng hệ thống.</p> `
    }
};

// Mở blog modal
function openBlogModal(blogKey) {
    const blog = blogData[blogKey];
    if (!blog) return;

    const modal = document.getElementById('blogModal');
    document.getElementById('modalTitle').textContent = blog.title;
    document.getElementById('modalImage').src = blog.image;
    document.getElementById('modalCategory').textContent = blog.category;
    document.getElementById('modalDate').textContent = blog.date;
    document.getElementById('modalReadTime').textContent = blog.readTime;
    document.getElementById('modalContent').innerHTML = blog.content;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Đóng blog modal
function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Cập nhật phần add event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Add click events cho blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card, index) => {
        const blogKeys = ['JavaBasic', 'OOP', 'Collections Framework', 'leetcode', 'hanwhalife', 'API', 'JS Basics', 'Exception Handling', 'DOM Manipulation', 'ES6', 'Async'];
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            openBlogModal(blogKeys[index]);
        });
    });

    // Close modal khi nhấn ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeBlogModal();
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("myAudio");
    const button = document.getElementById("playButton");

    button.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().catch(error => {
                console.log("Không thể phát nhạc:", error);
            });
        } else {
            audio.pause();
        }
    });
});

//Hien/an tat ca blog
const btn = document.getElementById("viewAllBtn");
let expanded = false; // trạng thái: false = đang thu gọn, true = đang mở rộng

btn.addEventListener("click", function() {
  const cards = document.querySelectorAll(".blog-card");

  if (!expanded) {
    // Hiện tất cả
    cards.forEach(card => card.classList.remove("hidden"));
    btn.innerHTML = 'Show Less <i class="fas fa-arrow-up"></i>';
    expanded = true;
  } else {
    // Thu gọn lại, chỉ giữ 3 bài đầu
    cards.forEach((card, index) => {
      if (index >= 3) {
        card.classList.add("hidden");
      }
    });
    btn.innerHTML = 'View All Articles <i class="fas fa-arrow-right"></i>';
    expanded = false;
  }
});

// Mở modal khi bấm vào thẻ chứng chỉ
document.querySelectorAll('.certificate-card').forEach(card => {
  card.addEventListener('click', () => {
    const fullSrc = card.getAttribute('data-full');
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');
    modalImg.src = fullSrc;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

// Đóng modal khi bấm nút đóng hoặc nền
const modal = document.getElementById('certModal');
const closeBtn = document.querySelector('.modal-close');

closeBtn.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.getElementById('certModalImg').src = '';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('certModalImg').src = '';
  }
});

// Đóng bằng phím Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('certModalImg').src = '';
  }
});


