// ========================================
// APP LOGIC - PAGE INTERACTIONS & FILTERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = document.title.toLowerCase();
    
    if (currentPage.includes('dashboard')) {
        initDashboard();
    } else if (currentPage.includes('conversations') || currentPage.includes('conversație')) {
        initConversations();
    } else if (currentPage.includes('leads')) {
        initLeads();
    } else if (currentPage.includes('knowledge base')) {
        initKnowledgeBase();
    } else if (currentPage.includes('settings')) {
        initSettings();
    }
});

// ========================================
// DASHBOARD PAGE
// ========================================

function initDashboard() {
    console.log('✅ Dashboard loaded');
    
    // Animate stat numbers on load
    const statNumbers = document.querySelectorAll('.text-3xl.font-bold');
    statNumbers.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200);
    });

    // Make conversation rows clickable
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
            window.location.href = 'conversations.html';
        });
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#F8FAFC';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });

    // "View all" leads button
    const viewAllBtn = document.querySelector('button');
    if (viewAllBtn && viewAllBtn.textContent.includes('View all')) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'leads.html';
        });
        viewAllBtn.style.cursor = 'pointer';
    }

    // Refresh button
    const refreshIcon = document.querySelector('header svg');
    if (refreshIcon) {
        const refreshBtn = refreshIcon.closest('div') || refreshIcon.parentElement;
        refreshBtn.style.cursor = 'pointer';
        refreshBtn.addEventListener('click', () => {
            const timeEl = document.querySelector('header span');
            if (timeEl) timeEl.textContent = 'Last updated: just now';
            // Flash effect
            document.querySelector('main').style.opacity = '0.7';
            setTimeout(() => {
                document.querySelector('main').style.opacity = '1';
            }, 300);
        });
    }
}

// ========================================
// CONVERSATIONS PAGE
// ========================================

function initConversations() {
    console.log('✅ Conversations page loaded');
    
    // Chat input functionality
    const chatSection = document.querySelector('section.flex-1');
    if (chatSection) {
        // Add a message input at the bottom of chat
        const inputContainer = document.createElement('div');
        inputContainer.className = 'sticky bottom-0 bg-white border-t border-gray-100 p-4 mt-auto';
        inputContainer.innerHTML = `
            <div class="flex items-center space-x-3">
                <input type="text" id="chatInput" placeholder="Type admin note..." class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500">
                <button id="sendNote" class="gold-bg text-black px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition">Send Note</button>
            </div>
        `;
        chatSection.appendChild(inputContainer);

        // Send note handler
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendNote');
        
        function sendNote() {
            const text = chatInput.value.trim();
            if (!text) return;
            
            const chatContainer = chatSection.querySelector('.space-y-6');
            if (chatContainer) {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'flex flex-col items-end';
                noteDiv.innerHTML = `
                    <span class="text-[10px] font-bold text-orange-500 mb-1 uppercase tracking-tight">Admin Note</span>
                    <div class="bg-orange-50 border border-orange-200 p-4 max-w-lg text-sm leading-relaxed text-orange-800 rounded-xl">
                        ${escapeHtml(text)}
                    </div>
                    <span class="text-[10px] text-gray-400 mt-1">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                `;
                chatContainer.appendChild(noteDiv);
                noteDiv.scrollIntoView({ behavior: 'smooth' });
            }
            chatInput.value = '';
        }

        sendBtn.addEventListener('click', sendNote);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendNote();
        });
    }

    // Export/Flag buttons
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Export Transcript')) {
            btn.addEventListener('click', () => {
                showToast('Transcript exported successfully!');
            });
        }
        if (btn.textContent.includes('Flag for Review')) {
            btn.addEventListener('click', () => {
                btn.textContent = '✓ Flagged';
                btn.classList.add('text-orange-600', 'border-orange-200', 'bg-orange-50');
                showToast('Conversation flagged for review');
            });
        }
        if (btn.textContent.includes('Contact Lead')) {
            btn.addEventListener('click', () => {
                showToast('Opening email client...');
                setTimeout(() => {
                    window.open('mailto:john.thompson@email.com?subject=Business Class Flight Inquiry');
                }, 500);
            });
        }
    });

    // New Conversation button
    const newConvBtn = document.querySelector('button.gold-bg');
    if (newConvBtn && newConvBtn.textContent.includes('New Conversation')) {
        newConvBtn.addEventListener('click', () => {
            showToast('New conversation panel would open here');
        });
    }
}

// ========================================
// LEADS PAGE
// ========================================

function initLeads() {
    console.log('✅ Leads page loaded');
    
    // Search functionality - filter existing table rows
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            let visibleCount = 0;
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const matches = !query || text.includes(query);
                row.style.display = matches ? '' : 'none';
                if (matches) visibleCount++;
            });
            
            // Update count
            const countEl = document.querySelector('.px-6.py-4 span.text-xs');
            if (countEl) countEl.textContent = `1-${visibleCount} of ${visibleCount} leads`;
        }, 250));
    }

    // Make table rows clickable
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', (e) => {
            if (e.target.closest('td:last-child')) {
                // Actions column - show dropdown
                showLeadActions(row);
                return;
            }
            // Navigate to conversation
            window.location.href = 'conversations.html';
        });
    });

    // Export CSV button
    const exportBtn = document.querySelector('button');
    if (exportBtn && exportBtn.textContent.includes('Export CSV')) {
        exportBtn.addEventListener('click', () => {
            showToast('Leads exported as CSV!');
        });
    }

    // Status filter dropdown
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const value = e.target.value.toLowerCase();
            if (value === 'all intents' || value === 'all status') return;
            
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(value) ? '' : 'none';
            });
        });
    });

    // Populate intent filter options
    const intentSelect = selects[0];
    if (intentSelect) {
        ['Flight Booking', 'Price Inquiry', 'Route Information'].forEach(intent => {
            const opt = document.createElement('option');
            opt.value = intent;
            opt.textContent = intent;
            intentSelect.appendChild(opt);
        });
    }

    // Populate status filter options
    const statusSelect = selects[1];
    if (statusSelect) {
        ['New', 'Contacted', 'Qualified', 'Converted'].forEach(status => {
            const opt = document.createElement('option');
            opt.value = status;
            opt.textContent = status;
            statusSelect.appendChild(opt);
        });
    }
}

function showLeadActions(row) {
    // Remove existing dropdown
    document.querySelectorAll('.lead-actions-dropdown').forEach(el => el.remove());
    
    const nameCell = row.querySelector('td:first-child');
    const name = nameCell ? nameCell.textContent.trim() : 'Lead';
    
    const dropdown = document.createElement('div');
    dropdown.className = 'lead-actions-dropdown fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50';
    dropdown.style.right = '2rem';
    dropdown.style.top = row.getBoundingClientRect().top + 'px';
    dropdown.innerHTML = `
        <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">View Details</button>
        <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">Send Email</button>
        <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">Mark as Contacted</button>
        <hr class="my-1 border-gray-100">
        <button class="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">Delete Lead</button>
    `;
    document.body.appendChild(dropdown);
    
    // Action handlers
    const buttons = dropdown.querySelectorAll('button');
    buttons[0].addEventListener('click', () => { window.location.href = 'conversations.html'; });
    buttons[1].addEventListener('click', () => { showToast('Opening email...'); dropdown.remove(); });
    buttons[2].addEventListener('click', () => { showToast(`${name} marked as contacted`); dropdown.remove(); });
    buttons[3].addEventListener('click', () => { 
        if (confirm(`Delete ${name}?`)) { row.remove(); showToast('Lead deleted'); }
        dropdown.remove();
    });
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 10);
}

// ========================================
// KNOWLEDGE BASE PAGE
// ========================================

function initKnowledgeBase() {
    console.log('✅ Knowledge Base loaded');
    
    // Search functionality
    const searchInput = document.querySelector('input[placeholder*="knowledge"]') || document.querySelector('input[placeholder*="Search"]');
    const cards = document.querySelectorAll('.grid > div[class*="bg-white"]');
    
    if (searchInput && cards.length) {
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.toLowerCase();
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = (!query || text.includes(query)) ? '' : 'none';
            });
        }, 250));
    }

    // Make category cards clickable
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3');
            if (title) {
                showToast(`Opening ${title.textContent} category...`);
            }
        });
    });

    // Add Entry button
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Add Entry')) {
            btn.addEventListener('click', () => {
                showAddEntryModal();
            });
        }
    });
}

function showAddEntryModal() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    overlay.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Add Knowledge Base Entry</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                    <select class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Company Info</option>
                        <option>Benefits</option>
                        <option>Routes</option>
                        <option>Booking</option>
                        <option>FAQ</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                    <input type="text" placeholder="Entry title..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Content</label>
                    <textarea rows="4" placeholder="Entry content..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"></textarea>
                </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button id="cancelEntry" class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button id="saveEntry" class="px-4 py-2 rounded-lg text-sm font-bold text-black" style="background-color: #C5A358;">Save Entry</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    overlay.querySelector('#cancelEntry').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#saveEntry').addEventListener('click', () => {
        showToast('Entry saved successfully!');
        overlay.remove();
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

// ========================================
// SETTINGS PAGE
// ========================================

function initSettings() {
    console.log('✅ Settings page loaded');
    
    // Toggle switches
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const setting = btn.getAttribute('data-setting');
            const isActive = btn.classList.contains('active');
            console.log(`${setting}: ${isActive}`);
            showToast(`${setting} ${isActive ? 'enabled' : 'disabled'}`);
        });
    });

    // Save All button
    const saveBtn = document.getElementById('saveAllBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Collect all form data
            const forms = document.querySelectorAll('form');
            const settings = {};
            forms.forEach(form => {
                const formData = new FormData(form);
                for (const [key, value] of formData.entries()) {
                    settings[key] = value;
                }
            });
            console.log('Settings saved:', settings);
            
            // Visual feedback
            saveBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved!';
            saveBtn.classList.add('bg-green-500');
            saveBtn.classList.remove('gold-bg');
            setTimeout(() => {
                saveBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Save All Changes';
                saveBtn.classList.remove('bg-green-500');
                saveBtn.classList.add('gold-bg');
            }, 2000);
            
            showToast('All settings saved successfully!');
        });
    }

    // API key toggle
    const toggleApiKey = document.getElementById('toggleApiKey');
    if (toggleApiKey) {
        toggleApiKey.addEventListener('click', () => {
            const input = document.querySelector('input[name="apiKey"]');
            if (input.type === 'password') {
                input.type = 'text';
                toggleApiKey.textContent = 'Hide';
            } else {
                input.type = 'password';
                toggleApiKey.textContent = 'Show';
            }
        });
    }

    // Copy embed code
    const copyEmbed = document.getElementById('copyEmbed');
    if (copyEmbed) {
        copyEmbed.addEventListener('click', () => {
            const code = document.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyEmbed.textContent = '✓ Copied!';
                setTimeout(() => { copyEmbed.textContent = 'Copy to clipboard'; }, 2000);
            }).catch(() => {
                showToast('Code copied!');
            });
        });
    }

    // Color pickers sync
    document.querySelectorAll('input[type="color"]').forEach(picker => {
        picker.addEventListener('input', (e) => {
            const textInput = picker.nextElementSibling;
            if (textInput) textInput.value = e.target.value;
        });
    });

    // Danger zone buttons
    const clearBtn = document.getElementById('clearConversations');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all conversations? This cannot be undone.')) {
                showToast('All conversations cleared');
            }
        });
    }

    const resetBtn = document.getElementById('resetSettings');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset all settings to defaults?')) {
                location.reload();
                showToast('Settings reset to defaults');
            }
        });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function showToast(message) {
    // Remove existing toasts
    document.querySelectorAll('.toast-notification').forEach(el => el.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 text-sm font-medium flex items-center space-x-2';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.innerHTML = `
        <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
