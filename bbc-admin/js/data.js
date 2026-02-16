// ========================================
// BBC ADMIN - MOCK DATA
// ========================================

const mockData = {
    conversations: [
        {
            id: 1,
            name: 'John Thompson',
            company: 'Tech Innovations Inc.',
            status: 'active',
            lastMessage: 'Looking forward to our next meeting',
            date: '2 min ago',
            avatar: 'JT',
            messages: [
                { id: 1, sender: 'user', text: 'Hi, interested in your class offering', time: '10:30 AM' },
                { id: 2, sender: 'ai', text: 'Great! What benefits interest you?', time: '10:31 AM' },
                { id: 3, sender: 'user', text: 'Networking opportunities', time: '10:32 AM' },
                { id: 4, sender: 'ai', text: 'Excellent. Our events connect industry leaders.', time: '10:33 AM' }
            ]
        },
        {
            id: 2,
            name: 'Sarah Mitchell',
            company: 'Global Marketing Ltd.',
            status: 'active',
            lastMessage: 'Thanks for the information!',
            date: '15 min ago',
            avatar: 'SM'
        },
        {
            id: 3,
            name: 'Michael Chen',
            company: 'Digital Solutions Co.',
            status: 'pending',
            lastMessage: 'Can you send me pricing?',
            date: '2 hours ago',
            avatar: 'MC'
        }
    ],
    
    leads: [
        {
            id: 1,
            name: 'John Thompson',
            email: 'john.thompson@techinnovations.com',
            company: 'Tech Innovations Inc.',
            phone: '+1 234-567-8900',
            status: 'qualified',
            source: 'LinkedIn',
            date: '2024-02-14',
            notes: 'VP Operations, enterprise package'
        },
        {
            id: 2,
            name: 'Sarah Mitchell',
            email: 'sarah.m@globalmarketing.com',
            company: 'Global Marketing Ltd.',
            phone: '+1 234-567-8901',
            status: 'contacted',
            source: 'Website',
            date: '2024-02-13',
            notes: 'CMO, leadership networking'
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'mchen@digitalsolutions.com',
            company: 'Digital Solutions Co.',
            phone: '+1 234-567-8902',
            status: 'new',
            source: 'Referral',
            date: '2024-02-15',
            notes: 'CTO, premium tier interested'
        }
    ],
    
    kb: [
        {
            id: 1,
            category: 'Company Info',
            title: 'About Buy Business Class',
            content: 'Our mission and values',
            author: 'Admin',
            date: '2024-02-10',
            views: 342
        },
        {
            id: 2,
            category: 'Services',
            title: 'Premium Membership Benefits',
            content: 'Explore all benefits',
            author: 'Marketing',
            date: '2024-02-12',
            views: 567
        },
        {
            id: 3,
            category: 'Pricing',
            title: 'Pricing Plans',
            content: 'Compare all tiers',
            author: 'Sales',
            date: '2024-02-11',
            views: 892
        }
    ]
};

// Utility functions
function getConversations() { return mockData.conversations; }
function getLeads() { return mockData.leads; }
function getKBArticles() { return mockData.kb; }

function filterByStatus(data, status) {
    return data.filter(item => item.status === status);
}

function searchData(data, query) {
    return data.filter(item => 
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.company?.toLowerCase().includes(query.toLowerCase()) ||
        item.email?.toLowerCase().includes(query.toLowerCase()) ||
        item.title?.toLowerCase().includes(query.toLowerCase())
    );
}
