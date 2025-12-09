// ===== Dynamic List with Stagger =====
const addItemBtn = document.getElementById('addItemBtn');
const itemInput = document.getElementById('itemInput');
const itemList = document.getElementById('itemList');

let itemIndex = 0;

addItemBtn.addEventListener('click', () => {
    const value = itemInput.value.trim();
    if (!value) return;

    const li = document.createElement('li');
    li.textContent = value;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.classList.add('btn', 'btn-gradient');
    deleteBtn.addEventListener('click', () => {
        li.style.opacity = 0;
        li.style.transform = 'translateX(30px) scale(0.9)';
        setTimeout(() => li.remove(), 400);
    });

    li.appendChild(deleteBtn);
    itemList.appendChild(li);

    // Stagger animation
    setTimeout(() => li.classList.add('show'), itemIndex * 100);
    itemIndex++;

    itemInput.value = '';
});

// ===== Ubah Warna Background =====
const colorButtons = document.querySelectorAll('.colorBtn');
colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        document.body.style.background = `linear-gradient(135deg, ${color}, #c3cfe2)`;
        document.body.classList.add('parallax');
    });
});

// ===== Counter =====
let count = 0;
const counterDisplay = document.getElementById('counter');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
const resetBtn = document.getElementById('resetBtn');

function updateCounter() {
    counterDisplay.textContent = count;
    counterDisplay.style.transform = 'scale(1.3)';
    setTimeout(() => counterDisplay.style.transform = 'scale(1)', 150);
}

increaseBtn.addEventListener('click', () => { count++; updateCounter(); });
decreaseBtn.addEventListener('click', () => { count--; updateCounter(); });
resetBtn.addEventListener('click', () => { count = 0; updateCounter(); });

// ===== Toggle Show/Hide =====
const toggleBtn = document.getElementById('toggleBtn');
const toggleParagraph = document.getElementById('toggleParagraph');

toggleBtn.addEventListener('click', () => {
    toggleParagraph.classList.toggle('hidden');
});

// ===== Update isi paragraf =====
const paragraphInput = document.getElementById('paragraphInput');
const updateParagraphBtn = document.getElementById('updateParagraphBtn');

updateParagraphBtn.addEventListener('click', () => {
    const text = paragraphInput.value.trim();
    if (text !== '') {
        toggleParagraph.textContent = text;
        paragraphInput.value = '';
        if (toggleParagraph.classList.contains('hidden')) {
            toggleParagraph.classList.remove('hidden');
        }
    }
});
