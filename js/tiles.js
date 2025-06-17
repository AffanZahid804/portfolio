document.addEventListener('DOMContentLoaded', () => {
    console.log('tiles.js loaded and running!'); // Added for debugging
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        const seeMoreBtn = tile.querySelector('.see-more');
        const closeBtn = tile.querySelector('.close-tile');
        const briefText = tile.querySelector('.brief-text');
        const expandedContent = tile.querySelector('.expanded-content');

        const initialHeight = tile.offsetHeight; // Get initial height when not expanded

        seeMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            tile.classList.add('active');
            
            // Calculate height for expanded content + brief text + heading + padding
            // We need to briefly show elements to measure their height
            briefText.style.display = 'none'; 
            expandedContent.style.display = 'block';

            const expandedHeight = tile.scrollHeight; // Get the full scroll height of the content
            
            // Set the height for smooth transition
            tile.style.height = `${expandedHeight}px`;

            // Revert display properties after a short delay
            setTimeout(() => {
                briefText.style.display = ''; 
                expandedContent.style.display = '';
            }, 300); // Match CSS transition duration

            // Hide the brief text and show the expanded content immediately after measurement
            briefText.style.display = 'none';
            expandedContent.style.display = 'block';

        });

        closeBtn.addEventListener('click', () => {
            tile.classList.remove('active');
            // Set height back to initial for collapse animation
            tile.style.height = `${initialHeight}px`;

            // Revert display properties after animation
            setTimeout(() => {
                briefText.style.display = '';
                expandedContent.style.display = '';
                tile.style.height = ''; // Remove fixed height after transition
            }, 300); // Match CSS transition duration
        });
    });
}); 