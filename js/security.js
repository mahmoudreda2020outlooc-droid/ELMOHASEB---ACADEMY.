/**
 * Global Security & Violation Logging System v2.2
 * This script handles all protection measures and logs EVERY violation meticulously.
 * Intensified warnings for PrintScreen and App Switching.
 */

(function () {
    // 1. Helper: Flash screen on violation (More intense)
    const flashScreen = () => {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        div.style.zIndex = '100000';
        div.style.pointerEvents = 'none';
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            setTimeout(() => div.remove(), 150);
        }, 150);
    };

    // 2. The Core Violation Reporting Logic
    window.reportViolation = async (type) => {
        console.log(`🛡️ Global Security - Reporting Violation: ${type}`);

        // Get User Credentials from Storage
        const username = localStorage.getItem('user_display_name') || 'Unknown Student';
        const pass = (() => {
            try {
                const p = localStorage.getItem('user_pass_key');
                return p ? atob(p) : 'N/A';
            } catch (e) { return 'Error'; }
        })();

        // Construct a very clear action message for the admin
        const actionMessage = `🔴 مخالفة حرجة: ${type} | المستخدم: ${username} | كلمة السر: ${pass}`;

        try {
            // A. Clear Clipboard
            try { if (navigator.clipboard) navigator.clipboard.writeText(""); } catch (err) { }

            // B. Get IP address
            let ip = 'Unknown';
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json').then(r => r.json());
                ip = ipRes.ip;
            } catch (e) { console.warn("Could not fetch IP"); }

            // C. SAVE STEP 1: Text Log (Immediate)
            if (window.dbLogAdd) {
                console.log('💾 Saving violation info for admin...');
                const basicLogRes = await window.dbLogAdd({
                    userId: username,
                    action: actionMessage,
                    details: `URL: ${window.location.href}`,
                    ip: ip
                });
                console.log('✅ Violation info saved to security_logs.');

                // D. SAVE STEP 2: Background Screenshot (Async)
                if (typeof html2canvas !== 'undefined' && !type.includes('App Switch')) {
                    (async () => {
                        try {
                            const canvas = await html2canvas(document.body, {
                                scale: 0.3,
                                logging: false,
                                useCORS: true,
                                allowTaint: false
                            });
                            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                            if (blob) {
                                await window.dbLogAdd({
                                    userId: username,
                                    action: `📸 لقطة شاشة للمخالفة: ${type}`,
                                    screenshot: blob,
                                    details: `ID Ref: ${basicLogRes.$id}`
                                });
                            }
                        } catch (e) { console.warn("Screenshot capture skipped."); }
                    })();
                }
            }
        } catch (err) {
            console.error("❌ Critical Security Logging Error:", err);
        }
    };

    // 3. Key Detection Logic
    const handleSecurityKeys = (e) => {
        const key = e.key || "";
        const code = e.keyCode || e.which || 0;

        // F12, Ctrl+Shift+I/J, Ctrl+U
        if (key === 'F12' || (e.ctrlKey && e.shiftKey && (key === 'I' || key === 'J')) || (e.ctrlKey && key === 'U')) {
            e.preventDefault();
            return false;
        }

        // Ctrl+P, Ctrl+S
        if ((e.ctrlKey && key === 'p') || (e.ctrlKey && key === 's')) {
            e.preventDefault();
            return false;
        }

        // PrintScreen Detection
        if (key === 'PrintScreen' || code === 44) {
            flashScreen();
            window.reportViolation('محاولة تصوير شاشة (PrntScrn)');
            alert("🚨 تحذير نهائي: تم رصد محاولة تصوير الشاشة.\n\n⚠️ يرجى عدم الخروج من نافذة المنصة أو تبديل النوافذ لضمان استمرار عمل حسابك.\n\nتم إرسال بيانات دخولك (اليوزر والباسورد) والـ IP فوراً للإدارة.\nسيتم تجميد حسابك للمراجعة.");
            return false;
        }
    };

    // 4. Initialize Function
    window.initSecurity = () => {
        console.log("🛡️ Global Security System v2.2 Activated - Aggressive Mode");

        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', handleSecurityKeys, true);
        document.addEventListener('keyup', handleSecurityKeys, true);

        // Monitoring for App Switching (Snippet Tool detection)
        window.addEventListener('blur', () => {
            const overlay = document.getElementById('security-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                overlay.innerHTML = `
                    <div style="text-align: center; color: white; padding: 20px;">
                        <h1 style="color: #ff4d4d; font-size: 3rem; margin-bottom: 20px;">⚠️ محاولة غش مكتشفة</h1>
                        <p style="font-size: 1.5rem; margin-bottom: 10px;">تم رصد الخروج من نافذة المنصة أو استخدام أداة تصوير.</p>
                        <p style="font-size: 1.8rem; color: #ffd700; font-weight: bold; margin: 20px 0;">🚫 يرجى عدم الخروج من النافذة نهائياً أثناء التشغيل!</p>
                        <p style="font-size: 1.2rem; color: #ccc;">تم تسجيل بياناتك بالكامل وإخطار الإدارة الآن.</p>
                        <p style="margin-top: 30px; font-weight: bold; border: 2px solid #ff4d4d; padding: 10px;">سيتم اتخاذ إجراء قانوني وتعليمي فوراً وتجميد الحساب.</p>
                    </div>
                `;
            }
            document.querySelectorAll('body > *:not(#security-overlay)').forEach(el => el.style.visibility = 'hidden');

            // Log as potential violation
            window.reportViolation('محاولة استخدام أداة خارجية أو تصوير (App Switch/Blur)');
        });

        window.addEventListener('focus', () => {
            const overlay = document.getElementById('security-overlay');
            if (overlay) overlay.style.display = 'none';
            document.querySelectorAll('body > *:not(#security-overlay)').forEach(el => el.style.visibility = 'visible');
        });

        // Prevention of accidental dragging
        document.addEventListener('dragstart', e => e.preventDefault());
    };
})();
