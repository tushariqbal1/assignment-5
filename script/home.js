
const api = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

const container = document.getElementById('issue-container')
const loader = document.getElementById('loader')
const issueCount = document.getElementById('issue-count')

let allIssues = []


async function fetchIssues() {

    try {

        loader.classList.remove('hidden')

        const res = await fetch(api)
        const data = await res.json()

        allIssues = data.data || []

        displayIssue(allIssues)

    }



    finally {
        loader.classList.add('hidden')
    }

}




function displayIssue(issues) {
    container.innerHTML = '';
    issueCount.innerText = `${issues.length} Issues`;

    issues.forEach(issue => {
        // 1. card er top border k design korte hobe
        const isOpen = issue.status?.toLowerCase() === 'open';
        const borderClass = isOpen ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500';

        const statusIcon = isOpen
            ? '<div class="w-6 h-6 flex items-center justify-center rounded-full border-2 border-dashed border-green-400 text-green-400 text-[10px]"><i class="fa-solid fa-circle-notch"></i></div>'
            : '<div class="w-6 h-6 flex items-center justify-center rounded-full border-2 border-purple-400 text-purple-400 text-[10px]"><i class="fa-solid fa-check"></i></div>';

        // 2.priority k map korte hobe
        const priorityStyles = {
            high: 'bg-red-50 text-red-400 border border-red-100',
            medium: 'bg-orange-50 text-orange-400 border border-orange-100',
            low: 'bg-gray-100 text-gray-400 border border-gray-200'
        };
        const pStyle = priorityStyles[issue.priority?.toLowerCase()] || 'bg-gray-50';

        // 3. label k map korte hobe
        const labelStyles = {
            bug: 'bg-red-50 text-red-500 border border-red-200',
            enhancement: 'bg-green-50 text-green-600 border border-green-200',
            'help wanted': 'bg-yellow-50 text-yellow-600 border border-yellow-200'
        };
        const lStyle = labelStyles[issue.label?.toLowerCase()] || 'bg-blue-50 text-blue-500 border border-blue-200';

        const card = document.createElement('div');
        card.className = `card bg-white shadow-sm border border-gray-100 ${borderClass} cursor-pointer hover:shadow-md transition-shadow`;

        card.innerHTML = `
            <div class="p-5">
                <div class="flex justify-between items-center mb-3">
                    ${statusIcon}
                    <span class="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${pStyle}">
                        ${issue.priority}
                    </span>
                </div>

                <h2 class="font-bold text-gray-800 leading-tight mb-2">
                    ${issue.title}
                </h2>
                <p class="text-xs text-gray-400 line-clamp-2 mb-4">
                    ${issue.description}
                </p>

                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${labelStyles['bug']}">
                        <i class="fa-solid fa-bug-slash text-[8px]"></i> BUG
                    </span>
                    <span class="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${labelStyles['help wanted']}">
                        <i class="fa-solid fa-handshake-angle text-[8px]"></i> HELP WANTED
                    </span>
                </div>

                <div class="border-t border-gray-100 pt-4 mt-2">
                    <p class="text-[11px] text-gray-500 font-medium">#1 by ${issue.author}</p>
                    <p class="text-[11px] text-gray-400 mt-1">${new Date(issue.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
            </div>
        `;

        card.addEventListener('click', () => openModal(issue));
        container.appendChild(card);
    });
}


function openModal(issue) {
    // 1. prothom e title set korte hobe
    document.getElementById('modal-title').innerText = issue.title;
    document.getElementById('modal-description').innerText = issue.description;

    // 2. priority k dynamic korte hobe 
    const isOpen = issue.status?.toLowerCase() === 'open';
    const statusBg = isOpen ? 'bg-green-500' : 'bg-purple-600';

    // Priority k design korte hobe
    const priorityColors = {
        high: 'bg-red-500',
        medium: 'bg-yellow-500',
        low: 'bg-blue-500'
    };
    const pColor = priorityColors[issue.priority?.toLowerCase()] || 'bg-gray-500';

    // 3. modal k dhore design korte hobe
    document.getElementById('modal-details').innerHTML = `
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <span class="${statusBg} text-white px-3 py-0.5 rounded-full text-xs font-medium">
                ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}ed
            </span>
            <span>•</span>
            <span>Opened by ${issue.author}</span>
            <span>•</span>
            <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>

        <div class="flex gap-2 mb-6">
            <span class="flex items-center gap-1 bg-red-50 text-red-400 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
               <i class="fa-solid fa-bug-slash"></i> BUG
            </span>
            <span class="flex items-center gap-1 bg-yellow-50 text-yellow-600 border border-yellow-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                <i class="fa-solid fa-handshake-angle"></i> HELP WANTED
            </span>
        </div>

        <div class="bg-gray-50 rounded-xl p-6 grid grid-cols-2 gap-4">
            <div>
                <p class="text-gray-400 text-sm mb-1">Assignee:</p>
                <p class="font-bold text-gray-800">${issue.author}</p>
            </div>
            <div>
                <p class="text-gray-400 text-sm mb-1">Priority:</p>
                <span class="${pColor} text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase">
                    ${issue.priority}
                </span>
            </div>
        </div>
    `;

    // 4. close btn k dhoro
    const modalAction = document.querySelector('.modal-action');
    modalAction.className = "modal-action flex justify-end mt-6";


    const closeBtn = modalAction.querySelector('button');
    closeBtn.className = "btn btn-primary btn-soft border border-primary px-8";

    document.getElementById('issue-modal').showModal();
}



document.querySelectorAll('.tab-btn').forEach(tab => {

    tab.addEventListener('click', () => {

        document.querySelectorAll('.tab-btn').forEach(t => {
            t.classList.remove('btn-primary');
            t.classList.add('btn-outline');
        });

        tab.classList.remove('btn-outline');
        tab.classList.add('btn-primary');

        const status = tab.dataset.status;

        if (status === 'all') {
            displayIssue(allIssues);
        } else {
            const filtered = allIssues.filter(i => i.status === status);
            displayIssue(filtered);
        }

    });

});



document.getElementById('search-btn').addEventListener('click', async () => {

    const text = document.getElementById('search-input').value

    loader.classList.remove('hidden')

    const res = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
    )

    const data = await res.json()

    displayIssue(data.data || [])

    loader.classList.add('hidden')

})



document.addEventListener("DOMContentLoaded", () => {
    fetchIssues()
})
