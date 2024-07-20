
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('#nav a');
    const sections = document.querySelectorAll('section');

    // Retrieve the saved section ID from localStorage
    const savedSectionId = localStorage.getItem('activeSectionId');

    // Function to show or hide the navigation menu
    const toggleNav = (show) => {
        if (show) {
            nav.style.left = '0'; // Show the navigation menu
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            nav.style.left = '-100%'; // Hide the navigation menu
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    // Show or hide the navigation menu when the button is clicked
    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        toggleNav(!isExpanded);
    });

    // Navigate to the respective section when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            navLinks.forEach(lnk => lnk.classList.remove('active')); // Remove active class from all links
            link.classList.add('active'); // Add active class to the clicked link

            const targetSectionId = link.getAttribute('href').substring(1); // Get the id of the target section
            const targetSection = document.getElementById(targetSectionId);

            // Hide all sections
            sections.forEach(section => section.style.display = 'none');

            // Display the target section
            if (targetSection) {
                targetSection.style.display = 'flex';
                // Save the active section ID to localStorage
                localStorage.setItem('activeSectionId', targetSectionId);
                // Hide the navigation menu after selection
                toggleNav(false);
            }
        });
    });

    // Display the saved section if it exists, otherwise display the default section (Home)
    if (savedSectionId) {
        const savedSection = document.getElementById(savedSectionId);
        if (savedSection) {
            sections.forEach(section => section.style.display = 'none'); // Hide all sections
            savedSection.style.display = 'flex'; // Show saved section
            // Mark the corresponding navigation link as active
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === savedSectionId) {
                    link.classList.add('active');
                }
            });
        }
    } else {
        sections.forEach(section => section.style.display = 'none'); // Hide all sections
        const homeSection = document.querySelector('#home');
        if (homeSection) {
            homeSection.style.display = 'flex'; // Show default section
            // Mark the home link as active
            navLinks.forEach(link => {
                if (link.getAttribute('href').substring(1) === 'home') {
                    link.classList.add('active');
                }
            });
        }
    }
});

// Save the current section ID before the page unloads
window.addEventListener('beforeunload', () => {
    const activeLink = document.querySelector('#nav a.active');
    if (activeLink) {
        const activeSectionId = activeLink.getAttribute('href').substring(1);
        localStorage.setItem('activeSectionId', activeSectionId);
    }
});


//==================================================================================================================



//==================================================================================================================

function loadUserData() {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('myself'));
    if (user) {
        document.getElementById('username').textContent = user.facebookName;
        document.getElementById('userImages').src = user.image; // Image URL from user bio
        document.getElementById('userBio').textContent = `Bio: ${user.bio}`; // Additional user bio
    } else {
        // Redirect to index.html if user data is not found
        window.location.href = 'index.html';
    }
}

// Load user data when the page loads
document.addEventListener('DOMContentLoaded', loadUserData);
//========================================================================================================================
document.addEventListener("DOMContentLoaded", () => {
    const friendsContainer = document.getElementById('friendsContainer');
    const viewOverlay = document.getElementById('viewOverlay');
    const viewOptions = document.getElementById('viewOptions');
    const largeImage = document.getElementById('largeImage');
    const closeOverlayButton = document.querySelector('.closeOverlay button');
    const downloadButton = document.getElementById('downloadButton');
    

    viewOverlay.style.display = 'none';

    function loadFriendsData() {
        const friends = JSON.parse(localStorage.getItem('friends'));
        if (friends && friends.length) {
            if (friends.length < 5) {
                window.location.href = 'index.html'; // Redirect if fewer than 5 friends
                return; // Exit function to prevent further execution
            }
            
            friends.forEach((friend, index) => {
                const friendDiv = createFriendElement(friend, index);
                friendsContainer.appendChild(friendDiv);

                // Add click event listener to each friend div
                friendDiv.addEventListener('click', () => {
                    showViewOverlay(friend);
                });
            });
        } else {
            window.location.href = 'index.html'; // Redirect if no friends data
        }
    }

    function createFriendElement(friend, index) {
        const friendDiv = document.createElement('div');
        friendDiv.classList.add('friend');

        const frontDiv = document.createElement('div');
        frontDiv.classList.add('friend-front');
        const img = document.createElement('img');
        img.src = friend.image;
        img.alt = `${friend.name}'s image`;
        frontDiv.appendChild(img);

        const backDiv = document.createElement('div');
        backDiv.classList.add('friend-back');
        const nameP = document.createElement('p');
        nameP.textContent = `Name: ${friend.name}`;
        backDiv.appendChild(nameP);

        friendDiv.appendChild(frontDiv);
        friendDiv.appendChild(backDiv);

        return friendDiv;
    }

    function showViewOverlay(friend) {
        // Clear previous options
        viewOptions.innerHTML = '';

        // Show the overlay
        viewOverlay.style.display = 'flex';

        const clipPaths = [
            'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Diamond
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Square
            'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)', // Cube
            'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', // Octagon
            'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)', // Irregular Pentagon
            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // Star
            'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)', // Trapezoid
            'polygon(25% 0%, 75% 0%, 100% 25%, 75% 50%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 25% 50%, 0% 25%)', // Arrow
            'polygon(50% 0%, 61% 35%, 100% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 0% 35%, 39% 35%)', // Pentagon
            'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)', // Hourglass
            'polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)', // Shield
            'polygon(0% 0%, 100% 0%, 100% 60%, 60% 100%, 40% 100%, 0% 60%)', // House
            'polygon(50% 0%, 90% 15%, 100% 50%, 90% 85%, 50% 100%, 10% 85%, 0% 50%, 10% 15%)', // Octagon Star
            'polygon(50% 0%, 90% 10%, 100% 35%, 90% 70%, 50% 90%, 20% 70%, 0% 35%, 10% 10%)', // Octagon Pentagon
            'polygon(0% 15%, 35% 0%, 65% 0%, 100% 15%, 100% 85%, 65% 100%, 35% 100%, 0% 85%)', // Octagon Square
            'polygon(50% 0%, 63% 25%, 95% 25%, 75% 45%, 85% 75%, 50% 55%, 15% 75%, 25% 45%, 5% 25%, 37% 25%)', // Star Cross
            'polygon(50% 0%, 80% 10%, 95% 40%, 80% 70%, 50% 90%, 20% 70%, 5% 40%, 20% 10%)', // Hexagon
            'polygon(50% 0%, 70% 15%, 95% 50%, 70% 85%, 50% 100%, 30% 85%, 5% 50%, 30% 15%)', // Hexagon Star
            'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)', // Custom shape
            'polygon(50% 20%, 90% 50%, 100% 80%, 50% 100%, 0% 80%)', // Heart shape
            'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)', //cube
            'polygon(0% 0%, 100% 0%, 100% 60%, 60% 100%, 40% 100%, 0% 60%)', //house
            'polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)', // custom
            'polygon(20% 0%, 80% 0%, 100% 20%, 100% 20%, 52% 100%, 46% 100%, 0 20%, 0% 20%)',//diamond
            'polygon(50% 20%, 90% 0, 100% 40%, 70% 100%, 50% 100%, 30% 100%, 0 40%, 10% 0)', //love
            'polygon(52% 33%, 72% 17%, 87% 27%, 86% 44%, 65% 75%, 50% 100%, 34% 74%, 19% 46%, 19% 26%, 36% 15%)',
            'polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)',
            'polygon(3.769% 22.712%, 83.418% 63.141%, 78.396% 63.141%, 81.475% 65.574%, 81.475% 65.574%, 83.224% 67.202%, 84.584% 68.981%, 85.556% 70.873%, 86.139% 72.841%, 86.333% 74.847%, 86.139% 76.852%, 85.556% 78.819%, 84.584% 80.709%, 83.224% 82.486%, 81.475% 84.11%, 81.475% 84.11%, 80.475% 84.839%, 79.42% 85.492%, 78.318% 86.069%, 77.174% 86.568%, 75.993% 86.992%, 74.782% 87.338%, 73.547% 87.607%, 72.293% 87.8%, 71.026% 87.916%, 69.752% 87.954%, 69.752% 87.954%, 68.479% 87.916%, 67.211% 87.8%, 65.955% 87.607%, 64.717% 87.338%, 63.504% 86.992%, 62.321% 86.568%, 61.174% 86.069%, 60.07% 85.492%, 59.015% 84.839%, 58.014% 84.11%, 53.339% 80.416%, 53.339% 86.895%, 53.339% 86.895%, 53.122% 89.021%, 52.493% 91.038%, 51.488% 92.919%, 50.139% 94.636%, 48.481% 96.163%, 46.549% 97.472%, 44.375% 98.538%, 41.996% 99.332%, 39.443% 99.829%, 36.753% 100%, 36.753% 100%, 34.062% 99.829%, 31.51% 99.332%, 29.13% 98.537%, 26.957% 97.472%, 25.024% 96.162%, 23.366% 94.635%, 22.018% 92.918%, 21.012% 91.038%, 20.383% 89.021%, 20.166% 86.895%, 20.166% 80.428%, 15.507% 84.11%, 15.507% 84.11%, 14.506% 84.839%, 13.451% 85.492%, 12.347% 86.069%, 11.2% 86.568%, 10.017% 86.992%, 8.804% 87.338%, 7.566% 87.607%, 6.311% 87.8%, 5.043% 87.916%, 3.769% 87.954%, 3.769% 87.954%, 2.495% 87.916%, 1.229% 87.8%, -0.025% 87.607%, -1.261% 87.338%, -2.472% 86.992%, -3.652% 86.568%, -4.797% 86.069%, -5.899% 85.492%, -6.953% 84.839%, -7.954% 84.11%, -7.954% 84.11%, -9.703% 82.486%, -11.063% 80.709%, -12.034% 78.819%, -12.617% 76.852%, -12.812% 74.847%, -12.617% 72.841%, -12.034% 70.873%, -11.063% 68.981%, -9.703% 67.202%, -7.954% 65.574%, -4.874% 63.141%, -9.897% 63.141%, -9.897% 63.141%, -12.588% 62.969%, -15.141% 62.472%, -17.521% 61.676%, -19.694% 60.609%, -21.626% 59.298%, -23.284% 57.77%, -24.633% 56.053%, -25.638% 54.173%, -26.266% 52.159%, -26.483% 50.036%, -26.483% 50.036%, -26.266% 47.913%, -25.638% 45.898%, -24.632% 44.018%, -23.283% 42.301%, -21.626% 40.773%, -19.693% 39.462%, -17.52% 38.395%, -15.14% 37.6%, -12.588% 37.102%, -9.897% 36.93%, -1.697% 36.93%, -7.954% 31.987%, -7.954% 31.987%, -9.703% 30.362%, -11.063% 28.585%, -12.034% 26.693%, -12.617% 24.725%, -12.812% 22.719%, -12.617% 20.713%, -12.034% 18.745%, -11.063% 16.853%, -9.703% 15.076%, -7.954% 13.451%, -7.954% 13.451%, -5.898% 12.069%, -3.649% 10.995%, -1.254% 10.227%, 1.236% 9.766%, 3.776% 9.613%, 6.315% 9.766%, 8.806% 10.227%, 11.2% 10.995%, 13.449% 12.069%, 15.505% 13.451%, 20.164% 17.134%, 20.164% 13.166%, 20.164% 13.166%, 20.382% 11.039%, 21.011% 9.022%, 22.018% 7.142%, 23.369% 5.425%, 25.028% 3.898%, 26.961% 2.588%, 29.135% 1.523%, 31.514% 0.728%, 34.064% 0.232%, 36.75% 0.061%, 36.75% 0.061%, 39.437% 0.232%, 41.987% 0.729%, 44.366% 1.523%, 46.54% 2.589%, 48.473% 3.899%, 50.132% 5.426%, 51.483% 7.143%, 52.49% 9.023%, 53.119% 11.04%, 53.337% 13.166%, 53.337% 17.147%, 58.012% 13.453%, 58.012% 13.453%, 60.068% 12.071%, 62.317% 10.997%, 64.711% 10.229%, 67.202% 9.768%, 69.741% 9.615%, 72.28% 9.768%, 74.771% 10.229%, 77.165% 10.997%, 79.415% 12.071%, 81.471% 13.453%, 81.471% 13.453%, 83.219% 15.078%, 84.58% 16.855%, 85.551% 18.746%, 86.134% 20.715%, 86.328% 22.721%, 86.134% 24.727%, 85.551% 26.695%, 84.58% 28.587%, 83.219% 30.364%, 81.471% 31.989%, 75.214% 36.932%, 83.414% 36.932%, 83.414% 36.932%, 86.105% 37.104%, 88.657% 37.6%, 91.037% 38.395%, 93.211% 39.461%, 95.143% 40.77%, 96.801% 42.297%, 98.149% 44.015%, 99.155% 45.895%, 99.783% 47.912%, 100% 50.037%, 100% 50.037%, 99.783% 52.163%, 99.155% 54.18%, 98.149% 56.06%, 96.8% 57.778%, 95.142% 59.305%, 93.21% 60.614%, 91.037% 61.68%, 88.657% 62.475%, 86.104% 62.971%, 83.414% 63.143%, 3.769% 22.712%)',
            'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)',
            'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
            'polygon(0 0, 100% 0, 51% 100%, 51% 100%)',
            'polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)',
            'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
            'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
            'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
            'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
            'polygon(50% 0%, 0% 100%, 100% 100%)',
            'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            'polygon(11% 20%, 35% 11%, 35% 0%, 70% 1%, 70% 25%, 70% 49%, 70% 49%, 69% 100%, 35% 100%, 34% 36%, 11% 40%)',
            'polygon(6% 6%, 92% 97%, -1% 94%, 96% 1%)',
            'polygon(75% 0%, 75% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
            'polygon(75% 0%, 45% 50%, 75% 100%, 0% 100%, -2% 50%, 0% 0%)',
            'polygon(100% -5%, -1% -2%, 1% 95%, 101% 96%, 43% 43%)',
            'polygon(100% -5%, -1% -2%, 48% 42%, 0% 93%, 100% 92%)',
            'polygon(68% 23%, 1% -1%, 8% 28%, 14% 63%, 98% 95%)',
            'polygon(95% 0%, 22% 15%, 0% 95%, 0% 96%, 75% 61%)',
            'polygon(50% 0%, 61% 16%, 80% 16%, 91% 29%, 100% 50%, 91% 71%, 80% 84%, 50% 100%, 20% 84%, 9% 71%, 0% 50%, 9% 29%, 20% 16%,39% 16%)',
            'polygon( 50% 0%, 60% 10%, 70% 15%, 80% 25%, 85% 40%, 80% 55%, 70% 70%, 60% 80%, 50% 90%, 40% 80%, 30% 70%, 20% 55%, 15% 40%, 20% 25%, 30% 15%, 40% 10%',
            'polygon(51% 24%, 60% 9%, 70% 4%, 85% 5%, 92% 12%, 93% 25%, 88% 40%, 83% 52%, 76% 62%, 66% 76%, 58% 86%, 49% 95%, 39% 83%, 30% 71%, 22% 59%, 15% 47%, 10% 36%, 9% 26%, 9% 16%, 16% 7%, 27% 5%, 36% 5%, 45% 10%)' ,
            'polygon(94% 4%, 44% 32%, 4% 18%, 12% 71%, 83% 67%)',   
            'polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)',
            'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)',
            'polygon(50% 0%, 100% 1%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 0 0)', 
            'polygon(15% 16%, 35% 10%, 35% 0%, 65% 0%, 65% 25%, 65% 25%, 65% 50%, 65% 50%, 65% 85%, 35% 85%, 34% 34%, 15% 38%)',
            'polygon(0% 0%,  100% 0%, 100% 20%, 20% 20%, 80% 80%, 0% 80%, 0% 100%, 100% 100%, 100% 80%, 20% 80%, 80% 20%, 0% 20%)',
            'polygon(0% 15%, 1% 0, 15% 0%, 85% 0%, 100% 0, 100% 15%, 100% 85%, 73% 85%, 83% 100%, 15% 100%, 30% 85%, 0% 85%)',
            'polygon(0 0, 100% 0, 100% 20%, 100% 80%, 100% 100%, 20% 100%, 0% 80%, 0% 20%)',
            'polygon(0 0, 100% 0, 100% 41%, 100% 80%, 76% 100%, 0 100%, 0 80%, 0 43%)',
            'polygon(0 0, 100% 0, 100% 41%, 100% 80%, 76% 100%, 0 100%, 0 80%, 0 43%)',
            'polygon(0 0, 0 100%, 100% 1%, 100% 100%, 46% 56%)',
            'polygon(35% 0, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 64% 0, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)',
            'polygon(0 51%, 0 25%, 0 0, 100% 0, 100% 26%, 100% 50%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 7% 50%)',
            'polygon(0 51%, 0 25%, 0 0, 100% 0, 100% 26%, 100% 50%, 100% 50%, 100% 100%, 50% 67%, 50% 67%, 0 100%, 0 49%)',
            'polygon(1% 0, 35% 0, 35% 0%, 65% 0%, 65% 0, 100% 0, 100% 33%, 65% 33%, 65% 100%, 35% 100%, 36% 34%, 0 34%)',
            'polygon(100% 1%, 52% 50%, 52% 0, 0 50%, 53% 100%, 52% 50%, 100% 100%)',
            'polygon(0 0, 100% 45%, 100% 45%, 42% 100%, 100% 45%, 0 99%, 0 45%)',
            'polygon(100% 0, 42% 52%, 0 55%, 100% 0, 100% 100%, 0 55%)',
            'polygon(0 21%, 58% 51%, 60% 0%, 100% 50%, 60% 100%, 58% 51%, 0% 80%)',
            'polygon(40% 0%, 42% 51%, 100% 0, 100% 100%, 42% 51%, 40% 100%, 0% 50%)',
            'polygon(0 0, 61% 47%, 60% 0%, 100% 50%, 60% 100%, 61% 47%, 0 100%)',
            'polygon(0 0, 61% 47%, 60% 0%, 100% 50%, 60% 100%, 61% 47%, 0 100%)',
            'polygon(49% 0, 50% 50%, 100% 0, 100% 100%, 50% 50%, 48% 100%, 0% 50%)',
            'polygon(100% 0%, 0 49%, 100% 50%, 0 100%, 0 49%, 100% 50%)',
            'polygon(45% 21%, 40% 10%, 32% 6%, 17% 4%, 6% 7%, 0% 15%, 1% 27%, 6% 42%, 10% 51%, 16% 61%, 22% 71%, 30% 81%, 43% 95%, 55% 84%, 67% 71%, 75% 59%, 81% 50%, 88% 39%, 93% 27%, 93% 16%, 86% 6%, 70% 5%, 58% 7%, 50% 15%, 46% 28%)',



            // Add more clip-path definitions as needed
        ];
        

        // Create clip path options dynamically
        clipPaths.forEach((path, i) => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('clip-path-option');
            optionDiv.style.clipPath = path;

            // Create image element for clip path option
            const optionImg = document.createElement('img');
            optionImg.src = friend.image; // Use friend's image
            optionImg.alt = `View ${i + 1}`;
            optionImg.style.clipPath = path; // Apply clip path to the image
            optionImg.addEventListener('click', () => {
                displayLargeImage(friend.image, path);
            });

            optionDiv.appendChild(optionImg);
            viewOptions.appendChild(optionDiv);
        });

        // Add click event listener to download button
        downloadButton.addEventListener('click', () => {
            downloadImage(largeImage.src, largeImage.style.clipPath, friend);
        });

        // Add close overlay functionality
        closeOverlayButton.addEventListener('click', () => {
            viewOverlay.style.display = 'none';
            largeImage.src = 'logo.png'; // Clear large image src
        });
    }

    function displayLargeImage(imageUrl, clipPath) {
        largeImage.src = imageUrl;
        largeImage.style.clipPath = clipPath; // Apply clip path to the large image
    }

    function downloadImage(imageUrl, clipPath, friend) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
    
        image.crossOrigin = 'anonymous';
    
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
    
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            if (clipPath) {
                const path2d = createClipPath(clipPath, canvas.width, canvas.height);
                context.save();
                context.beginPath();
                context.clip(path2d);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                context.restore();
            } else {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
    
            canvas.toBlob(function(blob) {
                // Create an <a> element to trigger download
                const a = document.createElement('a');
                const url = URL.createObjectURL(blob);
    
                // Set download attribute to specify the filename
                a.href = url;
                a.download = `Magical-Friend-${friend.name}.png`;
    
                // Append <a> to document, trigger download, and clean up
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
    
                // Clean up the object URL
                URL.revokeObjectURL(url);
            }, 'image/png');
        };
    
        image.src = imageUrl;
    }


    // Function to parse clip path string and create a Path2D object
    function createClipPath(clipPath, width, height) {
        const path = new Path2D();

        if (clipPath.startsWith('polygon')) {
            const points = clipPath.match(/\d+(\.\d+)?%/g).map(value => parseFloat(value) / 100);
            for (let i = 0; i < points.length; i += 2) {
                const x = points[i] * width;
                const y = points[i + 1] * height;
                if (i === 0) {
                    path.moveTo(x, y);
                } else {
                    path.lineTo(x, y);
                }
            }
            path.closePath();
        } else if (clipPath.startsWith('circle')) {
            const match = clipPath.match(/circle\((\d+(\.\d+)?%) at (\d+(\.\d+)?%) (\d+(\.\d+)?%)\)/);
            const radius = parseFloat(match[1]) / 100 * Math.min(width, height) / 2;
            const centerX = parseFloat(match[3]) / 100 * width;
            const centerY = parseFloat(match[5]) / 100 * height;
            path.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        } else if (clipPath.startsWith('ellipse')) {
            const match = clipPath.match(/ellipse\((\d+(\.\d+)?%) (\d+(\.\d+)?%) at (\d+(\.\d+)?%) (\d+(\.\d+)?%)\)/);
            const radiusX = parseFloat(match[1]) / 100 * width / 2;
            const radiusY = parseFloat(match[2]) / 100 * height / 2;
            const centerX = parseFloat(match[4]) / 100 * width;
            const centerY = parseFloat(match[6]) / 100 * height;
            path.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        }

        return path;
    }

    // Load friends data initially
    loadFriendsData();
});



//====================================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const viewOverlay = document.getElementById('viewOverlay');
    const closeOverlayButton = document.querySelector('.closeOverlay button');

    // Function to toggle the viewOverlay display
    function toggleViewOverlay() {
        viewOverlay.style.display = (viewOverlay.style.display === 'none' || viewOverlay.style.display === '') ? 'flex' : 'none';
    }

    // Event listener for closeOverlay button click
    closeOverlayButton.addEventListener('click', toggleViewOverlay);

    // Optional: Close overlay when clicking outside of it (if desired)
    viewOverlay.addEventListener('click', (event) => {
        if (event.target === viewOverlay) {
            toggleViewOverlay();
        }
    });
});

//===================================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const friendsContainer = document.getElementById('friendsContainer');
    const friends = Array.from(friendsContainer.children);

    function checkVisibility() {
        friends.forEach(friend => {
            const rect = friend.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (inView) {
                friend.classList.add('animate', 'visible'); // Add both classes
            } else {
                friend.classList.remove('animate', 'visible'); // Remove both classes
            }
        });
    }

    // Initial check on page load
    checkVisibility();

    // Attach scroll event listener to window
    window.addEventListener('scroll', checkVisibility);
});

//===================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('userCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const particles = [];
    const colors = ['#ff00ff', '#ff99ff', '#cc00cc', '#ff66ff', '#ff33ff'];
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.1) this.size -= 0.01;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].size <= 0.1) {
                particles.splice(i, 1);
                i--;
            }
        }
    }

    function createParticles() {
        const rect = canvas.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;

        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(x, y));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animate);
    }

    // Create particles continuously
    setInterval(createParticles, 100);

    animate();
});

//======================================================================================================================


document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element
    const canvas = document.getElementById('magiic-2');

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 10;

    // Load the textures for the cubes and heart
    const textureLoader = new THREE.TextureLoader();
    const magic5Texture = textureLoader.load('magic5.png');
    const logoTexture = textureLoader.load('logo.png');
    const heartTexture = textureLoader.load('heart.png');

    // Arrays to hold cube meshes
    const magic5Cubes = [];
    const logoCubes = [];

    // Function to create cubes
    function createCube(texture, isMagic5) {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cubeMesh = new THREE.Mesh(geometry, material);
        cubeMesh.position.set(Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40);
        scene.add(cubeMesh);

        if (isMagic5) {
            magic5Cubes.push(cubeMesh);
        } else {
            logoCubes.push(cubeMesh);
        }

        return cubeMesh;
    }

    // Function to create falling hearts
    function createFallingHeart(position) {
        const heartGeometry = new THREE.PlaneGeometry(6, 6); // Increase size here (width, height)
        const heartMaterial = new THREE.MeshBasicMaterial({ map: heartTexture, transparent: true });
        const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
        heartMesh.position.copy(position);
        scene.add(heartMesh);

        // Animation to scale and fade the heart
        function animateHeart() {
            heartMesh.scale.x += 0.1;
            heartMesh.scale.y += 0.1;
            heartMesh.material.opacity -= 0.09;

            if (heartMesh.material.opacity <= 0) {
                scene.remove(heartMesh);

                // Reset cube colors after romantic animation (1 second delay)
                setTimeout(() => {
                    magic5Cubes.forEach(cube => {
                        cube.material.color.setHex(0xffffff); // Revert to original color (white)
                    });
                    logoCubes.forEach(cube => {
                        cube.material.color.setHex(0xffffff); // Revert to original color (white)
                    });
                }, 2000); // Delay in milliseconds
            } else {
                requestAnimationFrame(animateHeart);
            }
        }

        animateHeart();
    }

    // Create magic5 cubes
    for (let i = 0; i < 20; i++) {
        createCube(magic5Texture, true);
    }

    // Create logo cubes
    for (let i = 0; i < 20; i++) {
        const logoCube = createCube(logoTexture, false);

        // Random initial movement towards magic5 cubes
        const targetCube = magic5Cubes[Math.floor(Math.random() * magic5Cubes.length)];
        logoCube.userData.targetCube = targetCube;
    }

    // Function to handle cube interactions
    function handleCubeInteractions() {
        logoCubes.forEach(logoCube => {
            const targetCube = logoCube.userData.targetCube;
            if (targetCube) {
                const direction = new THREE.Vector3();
                direction.subVectors(targetCube.position, logoCube.position).normalize();
                logoCube.position.add(direction.multiplyScalar(0.5)); // Adjust chase speed here

                const distance = logoCube.position.distanceTo(targetCube.position);
                if (distance < 5) { // Collision threshold
                    createFallingHeart(targetCube.position);

                    // Change cube colors to red
                    logoCube.material.color.setHex(0xff0000);
                    targetCube.material.color.setHex(0xff0000);

                    // Reset cube positions after collision
                    logoCube.position.set(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20);
                    targetCube.position.set(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20);
                }
            }
        });

        // Schedule the next interaction check
        setTimeout(handleCubeInteractions, 500); // Check every 0.1 seconds
    }

    // Start cube interactions
    handleCubeInteractions();

    // Animation and rendering loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate cubes slowly for a magical effect
        magic5Cubes.forEach(cube => {
            cube.rotation.x += 0.0095;
            cube.rotation.y += 0.0095;
        });

        logoCubes.forEach(cube => {
            cube.rotation.x -= 0.0075;
            cube.rotation.y -= 0.0075;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize the renderer when the window is resized
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});



//===================================================================================================================

const canvasMagic = document.getElementById('magiic-1');
const sceneMagic = new THREE.Scene();
const cameraMagic = new THREE.PerspectiveCamera(75, canvasMagic.clientWidth / canvasMagic.clientHeight, 0.1, 1000);
const rendererMagic = new THREE.WebGLRenderer({ canvas: canvasMagic });
rendererMagic.setSize(canvasMagic.clientWidth, canvasMagic.clientHeight);

// Load the logo texture
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('logo.png'); // Update the path to your logo image

const logoTwoTexture = textureLoader.load('magic5.png');

// Load user image from local storage
const userImageUrl = JSON.parse(localStorage.getItem('myself')); // Assuming the image URL is stored in local storage
const userTexture = textureLoader.load(userImageUrl.image); // Corrected the path to user image

// Function to get friends' images from localStorage and create textures
function loadFriendTextures() {
    const textures = [];
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    friends.forEach(friend => {
        const texture = textureLoader.load(friend.image); // Assuming friend.image is the URL to the friend's image
        textures.push(texture);
    });
    return textures;
}

const friendTextures = loadFriendTextures();

// Function to create cubes with a given texture
function createCube(texture) {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); // Smaller size for small screens
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5);
    sceneMagic.add(cube);
    return cube;
}

// Function to load cubes into the magic effect scene
function loadMagicScene() {
    sceneMagic.children = [];

    const textures = [logoTexture, logoTwoTexture, userTexture, ...friendTextures];
    for (let i = 0; i < 200; i++) {
        const texture = textures[Math.floor(Math.random() * textures.length)];
        createCube(texture);
    }

    function animate() {
        requestAnimationFrame(animate);

        sceneMagic.children.forEach(cube => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube.position.y -= 0.05; // Move the cube downwards

            // Reset the cube position when it goes out of view
            if (cube.position.y < -5) {
                cube.position.y = Math.random() * 10 + 5;
                cube.position.x = Math.random() * 10 - 5;
                cube.position.z = Math.random() * 10 - 5;
            }
        });

        rendererMagic.render(sceneMagic, cameraMagic);
    }

    animate();
}

loadMagicScene();

// Resize the magic effect renderer when the window is resized
window.addEventListener('resize', () => {
    const width = canvasMagic.clientWidth;
    const height = canvasMagic.clientHeight;
    rendererMagic.setSize(width, height);
    cameraMagic.aspect = width / height;
    cameraMagic.updateProjectionMatrix();

    // Adjust cube size based on screen size
    const scale = Math.min(width, height) / 600; // Scale factor based on smaller screen dimension
    sceneMagic.children.forEach(cube => {
        cube.scale.set(scale, scale, scale); // Apply scale to cubes
    });
});

// Scroll-based movement
let scrollOffset = 0;
let previousScrollOffset = 0;

window.addEventListener('scroll', () => {
    scrollOffset = window.scrollY;

    // Check scroll direction and update cube positions accordingly
    const scrollDirection = scrollOffset > previousScrollOffset ? 'down' : 'up';

    sceneMagic.children.forEach(cube => {
        // Update cube position based on scroll direction
        if (scrollDirection === 'down') {
            cube.position.y -= 0.05; // Continue to move down when scrolling down
        } else {
            cube.position.y += 0.09; // Move up when scrolling up
        }

        // Reset the cube position when it goes out of view
        if (cube.position.y < -5) {
            cube.position.y = Math.random() * 10 + 5;
            cube.position.x = Math.random() * 10 - 5;
            cube.position.z = Math.random() * 10 - 5;
        }
    });

    previousScrollOffset = scrollOffset; // Update the previous scroll offset for the next iteration
});


//=============================================================================================================================


document.addEventListener('DOMContentLoaded', () => {
    const songCards = document.querySelectorAll('.song-card');
    const userSongInput = document.getElementById('getUserSong');
    const overlay = document.getElementById('overlay');
    const logo = document.getElementById('logo');
    const userImage = document.getElementById('userImage');
    

    let currentAudio = null;


     // Retrieve user image from localStorage
     const userImageUrls = JSON.parse(localStorage.getItem('myself')).image;
     if (userImageUrls) {
         userImage.src = userImageUrls;
     } else {
         window.location.href = 'index.html';
     }

    function showOverlay() {
        overlay.classList.add('show-overlay');
        logo.style.animation = 'swapPosition 4s ease-in-out 0s 3 alternate both;';
        userImage.style.animation = 'swapPosition 4s infinite';
    }
    
    
    function hideOverlay() {
        overlay.classList.remove('show-overlay');
        logo.style.animation = 'none';
        userImage.style.animation = 'none';
    }

    songCards.forEach(card => {
        const playButton = card.querySelector('.details .deeper-details button:first-child');
        const audio = card.querySelector('audio');
        const durationDisplay = card.querySelector('.duration');
        const canvas = card.querySelector('.visualizer');
        const cardLogo = card.querySelector('.logo');
        

        audio.addEventListener('waiting', showOverlay);
        audio.addEventListener('stalled', showOverlay);
        audio.addEventListener('playing', hideOverlay);
        audio.addEventListener('pause', hideOverlay);
        audio.addEventListener('ended', hideOverlay);
        audio.addEventListener('loadedmetadata', hideOverlay);


        // Check if all elements exist
        if (!playButton || !audio || !durationDisplay || !canvas) {
            alert('One or more elements not found in song card:', card);
            return;
        }

        const canvasContext = canvas.getContext('2d');
        let audioContext, analyser, dataArray, bufferLength;



        let isPlaying = false;
        playButton.addEventListener('click', () => {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                const currentCard = currentAudio.closest('.song-card');
                currentCard.querySelector('.details .deeper-details button:first-child').innerHTML = '&#9654;';
                currentCard.classList.remove('playing');
                const currentCardLogo = currentCard.querySelector('.logo');
                if (currentCardLogo) {
                    currentCardLogo.style.display = 'block';
                }

                currentCard.querySelector('.visualizer').getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                isPlaying = false;
            }
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = "&#10073; &#10073;";
                currentAudio = audio;
                card.classList.add('playing');
                cardLogo.style.display = 'none';
                setupVisualizers(audio, canvasContext);
                isPlaying = true;
            } else {
                audio.pause();
                playButton.innerHTML = '&#9654;';
                currentAudio = null;
                card.classList.remove('playing');
                cardLogo.style.display = "block";
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                isPlaying = false;
            }
        });

        audio.addEventListener('timeupdate', () => {
            durationDisplay.innerHTML = "&#9835; " + formatTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            playButton.innerHTML = '&#9654;';
            currentAudio = null;
            card.classList.remove('playing');
            cardLogo.style.display = "block";
            isPlaying = false;
        });

        audio.addEventListener('play', () => {
            card.classList.add('playing');
            cardLogo.style.display = "none";
            isPlaying = true;
        })

        function setupVisualizers(audio, canvasContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            

            analyser.fftSize = 128;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            draw();
        

        function draw() {
            
            if (!currentAudio || currentAudio !== audio) return;
                requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                canvasContext.fillStyle = 'rgb(0, 0, ' + (barHeight + 100) + ')'; // Blue bars
                canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }
        }
    }

        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }
    });

    userSongInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            createSongCard(file.name, fileURL);
            const newCard = document.querySelector('.song-card:last-child');
            newCard.scrollIntoView({ behavior: 'smooth' });
        }
    });

    function createSongCard(name, url) {
        const section = document.getElementById('songs');
        const card = document.createElement('div');
        card.classList.add('song-card');
        card.innerHTML = `
            <div class="logo"></div>
            <h3>${name}</h3>
            <div class="song-audio">
                <audio src="${url}"></audio>
            </div>
            <div class="duration">0:00</div>
            <div class="details">
                <div class="deeper-details">
                    <div class="all-button-container">
                        <button>&#9654;</button>
                        <button>&#9655;</button>
                        <button>Select</button>
                    </div>
                    <canvas class="visualizer"></canvas>
                </div>
            </div>
        `;
        section.appendChild(card);

        const playButton = card.querySelector('.details .deeper-details button:first-child');
        const audio = card.querySelector('audio');
        const durationDisplay = card.querySelector('.duration');
        const canvas = card.querySelector('.visualizer');
        const cardLogo = card.querySelector('.logo');

        // Check if all elements exist
        if (!playButton || !audio || !durationDisplay || !canvas) {
            alert('One or more elements not found in newly created song card:', card);
            return;
        }

        const canvasContexts = canvas.getContext('2d');
        let audioContext, analyser, dataArray, bufferLength;

        playButton.addEventListener('click', () => {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                const currentCard = currentAudio.closest('.song-card');
                currentCard.querySelector('.details .deeper-details button:first-child').innerHTML = '&#9654;';
                currentCard.classList.remove('playing');
                const currentCardLogo = currentCard.querySelector('.logo');
                if (currentCardLogo) {
                    currentCardLogo.style.display = 'block';
                }
            }
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = "&#10073; &#10073;";
                currentAudio = audio;
                card.classList.add('playing');
                cardLogo.style.display = 'none';
                setupVisualizer(audio, canvasContexts);
                
            } else {
                audio.pause();
                playButton.innerHTML = '&#9654;';
                currentAudio = null;
                card.classList.remove('playing');
                cardLogo.style.display = 'block';
            }
        });

        audio.addEventListener('timeupdate', () => {
            durationDisplay.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            playButton.innerHTML = '&#9654;';
            currentAudio = null;
            card.classList.remove('playing');
            cardLogo.style.display = 'block';
        });

        function setupVisualizer(audio, canvasContexts) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            analyser.fftSize = 128;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            draw();
        }

        function draw() {
            if (!currentAudio) return;
            requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);
            canvasContexts.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                canvasContexts.fillStyle = 'rgb(0, 0, ' + (barHeight + 100) + ')'; // Blue bars
                canvasContexts.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }
        }

        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }
    }
});

//======================================================================================================================================


document.addEventListener('DOMContentLoaded', () => {
    const friendsView = document.querySelector('.friends-view');
    const selectedSongContainers = document.querySelector('.selected-song');

    // Retrieve friends data from localStorage
    const friendsData = JSON.parse(localStorage.getItem('friends'));


    // Function to disable all checkboxes
    const disableAllCheckboxes = () => {
        const checkboxes = document.querySelectorAll('.friend-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.disabled = true;
            checkbox.style.display = "none";
        });
    };

    // Function to enable all checkboxes
    const enableAllCheckboxes = () => {
        const checkboxes = document.querySelectorAll('.friend-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox.style.display = "block";
        });
    };
    
    
    // Function to check if song cards exist and update checkbox states
    const checkSongCardsAndUpdateCheckboxes = () => {
        if (selectedSongContainers.children.length <= 1) {
            disableAllCheckboxes();
        } else {
            enableAllCheckboxes();
        }
    };

    // Check if friendsData is available
    if (friendsData && Array.isArray(friendsData)) {
        friendsData.forEach(friend => {
            const friendCard = document.createElement('div');
            friendCard.classList.add('friend-card');
            friendCard.innerHTML = `
            <img src="${friend.image}" alt="${friend.name}"><br><input type="checkbox" class="friend-checkbox">`;
            
            const checkbox = friendCard.querySelector('.friend-checkbox');
            friendCard.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                // Handle click event for friend card
                console.log(`Clicked on friend: ${friend.name}`);
            });
            friendsView.appendChild(friendCard);

            // Initial check on page load
        checkSongCardsAndUpdateCheckboxes();

        // Listen for changes in selectedSongContainer and update checkbox states
        selectedSongContainers.addEventListener('DOMSubtreeModified', checkSongCardsAndUpdateCheckboxes);
        });
    } else {
        console.error('Friends data not found in localStorage');
    }
});


//=================================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const selectedSongContainer = document.querySelector('.selected-song');
    let currentlyPlaying = null; // To track the currently playing audio element
    const titleH3 = document.querySelector('#slideshows h4'); // Correctly reference the title h3
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    // Function to show loading indicator
    const showAudioLoading = () => {
        loadingIndicator.style.display = "block";
    };

    // Function to hide loading indicator
    const hideAudioLoading = () => {
        loadingIndicator.style.display = "none";
    };
    
    // Function to disable all buttons
    const disableAllButtons = () => {
        const buttons = document.querySelectorAll('#slideshow-1 button');
        buttons.forEach(button => button.disabled = true);
    };

    // Function to enable all buttons
    const enableAllButtons = () => {
        const buttons = document.querySelectorAll('#slideshow-1 button');
        buttons.forEach(button => button.disabled = false);
    };

    hideAudioLoading();

    // Function to check if selectedSongContainer has no child elements and toggle title h3 visibility
    const checkSelectedSongContainer = () => {
        if (selectedSongContainer.children.length <= 1) {
            titleH3.style.display = "block";
            disableAllButtons();
        } else {
            titleH3.style.display = "none";
            enableAllButtons();
        }
    };

    // Initial check on page load
    checkSelectedSongContainer();

    selectedSongContainer.addEventListener('DOMSubtreeModified', checkSelectedSongContainer);

    // Event delegation for handling select button clicks
    document.addEventListener('click', (event) => {
        const targetButton = event.target.closest('.song-card button:nth-of-type(3)');
        if (!targetButton) return; // Exit if the clicked element is not a select button

        if (targetButton.classList.contains('selected')) {
            return; // Prevent selecting the same song again
        }

        const songCard = targetButton.closest('.song-card');
        const audio = songCard.querySelector('audio');

        // Pause currently playing audio (if any)
        if (currentlyPlaying) {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0; // Reset the current time
        }

        // Create a new song card container
        const newSongCard = document.createElement('div');
        newSongCard.classList.add('song-carded');

        const title = document.createElement('h3');
        title.textContent = songCard.querySelector('h3').textContent;

        const newAudio = document.createElement('audio');
        newAudio.src = audio.src;
        newAudio.controls = false; // Add controls if you want play/pause button

        // Add event listeners to handle audio loading and playing states
        newAudio.addEventListener('waiting', showAudioLoading);
        newAudio.addEventListener('stalled', showAudioLoading);
        newAudio.addEventListener('playing', hideAudioLoading);
        newAudio.addEventListener('pause', hideAudioLoading);
        newAudio.addEventListener('ended', hideAudioLoading);
        newAudio.addEventListener('loadedmetadata', hideAudioLoading);
        newAudio.addEventListener('canplay', hideAudioLoading);
        newAudio.addEventListener('canplaythrough', hideAudioLoading);

        const details = document.createElement('div');
        details.classList.add('detail');

        const deeperDetails = document.createElement('div');
        deeperDetails.classList.add('deeper-details');

        const playButton = document.createElement('button');
        playButton.innerHTML = '&#9655;';
        playButton.classList.add('play-button');

        // Add play button functionality
        playButton.addEventListener('click', () => {
            if (newAudio.paused) {
                if (currentlyPlaying && currentlyPlaying !== newAudio) {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                    const currentPlayButton = currentlyPlaying.closest('.song-carded').querySelector('.play-button');
                    if (currentPlayButton) currentPlayButton.innerHTML = '&#9655;';
                }
                newAudio.play();
                playButton.innerHTML = '&#10073; &#10073;';
                currentlyPlaying = newAudio;
            } else {
                newAudio.pause();
                playButton.innerHTML = '&#9655;';
            }
        });

        newAudio.addEventListener('ended', () => {
            playButton.innerHTML = '&#9655;';
        });

        const delAndPickContainer = document.createElement('div');
        delAndPickContainer.classList.add('del-pick-container');

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '🗑️'; // Unicode for bin icon

        // Add delete button functionality
        deleteButton.addEventListener('click', () => {
            newSongCard.remove();
            targetButton.classList.remove('selected');
            targetButton.innerHTML = 'Select';
            targetButton.disabled = false;
            checkSelectedSongContainer();
        });

        const pickButton = document.createElement('input');
        pickButton.type = 'checkbox';
        pickButton.classList.add('pickButton');

        // Event listener to check/uncheck the checkbox when the new song card is clicked
        newSongCard.addEventListener('click', (event) => {
            // Check if the clicked element is the play button
            if (event.target.classList.contains('play-button')) {
                return; // Exit the function if the play button was clicked
            } else if (event.target.classList.contains('delete-button')) {
                return; // Exit the function if the delete button was clicked
            }
            // Toggle the checked state of the checkbox otherwise
            pickButton.checked = !pickButton.checked;
        });

        deeperDetails.appendChild(playButton);
        details.appendChild(deeperDetails);

        newSongCard.appendChild(title);
        newSongCard.appendChild(newAudio);
        newSongCard.appendChild(details);
        delAndPickContainer.appendChild(deleteButton);
        delAndPickContainer.appendChild(pickButton);
        newSongCard.appendChild(delAndPickContainer);

        // Append the new song card to the selected-song container
        selectedSongContainer.appendChild(newSongCard);
        checkSelectedSongContainer();

        // Toggle the select button to show it's selected
        targetButton.classList.add('selected');
        targetButton.innerHTML = '&#9989; Selected';
        targetButton.disabled = true;
    });
});

//========================================================================================================================================

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.after-loading');
    const audio = document.getElementById('loading-audio');
    const lyricsContainer = document.getElementById('lyrics');
    const closeButton = document.getElementById('close-after-loading');

    overlay.style.display = 'block'; // Show the overlay

    // Define lyrics with timing and stars
    const lyrics = [
        { time: 65, text: ' Take my hand ' },
        { time: 69, text: ' Believe me when I say ' },
        { time: 73, text: ' I am here for you always ' },
        { time: 78, text: ' Take my hand ' },
        { time: 81, text: ' And Everything could change ' },
        { time: 83, text: ' But one thing stays the same ' },
        { time: 87, text: " I'm here for you always " },
    ];

    // Function to display lyrics word by word with animation
    function displayLyrics(lyric) {
        lyricsContainer.innerHTML = ''; // Clear previous lyrics
        const words = lyric.text.split(' '); // Split lyric into words

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.animationDelay = `${index * 0.2}s`; // Delay for each word
            span.style.animationDuration = '3s'; // Duration for each word animation
            lyricsContainer.appendChild(span);
        });
    }

    // Function to scroll to #magicEffect with an additional 10px offset
    function scrollToMagicEffect() {
        const magicEffect = document.getElementById('magicEffect');
        if (magicEffect) {
            // Scroll into view first
            magicEffect.scrollIntoView({ behavior: 'smooth' });

            // Additional scroll offset after a small delay
            setTimeout(() => {
                window.scrollBy({ top: 0, behavior: 'smooth' });
            }, 500); // Adjust the delay as needed to match the smooth scroll duration
        }
    }



    scrollToMagicEffect();

    // Function to scroll to the top
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    // Function to close the overlay, stop the audio, and scroll to the top
    function closeOverlay() {
        audio.pause(); // Pause the audio
        overlay.style.display = 'none'; // Hide the overlay
        scrollToTop(); // Scroll to the top of the page
    }

    // Start playing audio after a delay (adjust as needed)
    setTimeout(function() {
        audio.currentTime = 65; // Start audio at 65 seconds
        audio.play();
        scrollToMagicEffect();
    }, 500); // Delay before starting audio (0.5 seconds)

    // Check audio time to display lyrics
    audio.addEventListener('timeupdate', function() {
        const currentTime = Math.floor(audio.currentTime);

        // Find current lyric based on time
        const currentLyric = lyrics.find(lyric => currentTime === lyric.time);

        if (currentLyric) {
            displayLyrics(currentLyric);
        }
    });

    // Pause audio and remove overlay when it reaches 90 seconds
    audio.addEventListener('timeupdate', function() {
        if (audio.currentTime >= 92) {
            audio.pause(); // Pause the audio
            overlay.style.display = 'none'; // Hide the overlay
            scrollToMagicEffect();
        }
    });

    // Check if the page was reloaded or initially loaded
    const navigationType = window.performance.getEntriesByType('navigation')[0]?.type;
    if (navigationType === 'reload' || navigationType === 'back_forward') {
        const isHomeSection = window.location.hash === '' || window.location.hash === '#home';
        if (isHomeSection && overlay.style.display === 'block') {
            scrollToMagicEffect();
            
        }
    }

    // Add event listener to the close button
    closeButton.addEventListener('click', function() {
        closeOverlay();
    });

    // Event listener for page reload or close
    window.addEventListener('beforeunload', function(event) {
        
        overlay.style.display = 'block';
        const lyrics = [
            { time: 65, text: ' Take my hand ' },
            { time: 69, text: ' Believe me when I say ' },
            { time: 73, text: ' I am here for you always ' },
            { time: 78, text: ' Take my hand ' },
            { time: 81, text: ' And Everything could change ' },
            { time: 83, text: ' But one thing stays the same ' },
            { time: 87, text: " I'm here for you always " },
        ];

        // Start playing audio after a delay (adjust as needed)
        setTimeout(function() {
            audio.currentTime = 65; // Start audio at 65 seconds
            audio.play();
            scrollToMagicEffect();
        }, 500); // Delay before starting audio (0.5 seconds)

        // Check audio time to display lyrics
        audio.addEventListener('timeupdate', function() {
            const currentTime = Math.floor(audio.currentTime);

            // Find current lyric based on time
            const currentLyric = lyrics.find(lyric => currentTime === lyric.time);

            if (currentLyric) {
                displayLyrics(currentLyric);
            }
        });

        displayLyrics(lyric);
    });

});



//========================================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    let currentAudio = null; // Track currently playing audio

    // Function to stop all audio playback
    const stopAllAudios = () => {
        document.querySelectorAll('.song-card audio').forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                // Update play button icon to play symbol
                const songCard = audio.closest('.song-card');
                const playButton = songCard.querySelector('.all-button-container button:nth-of-type(1)');
                playButton.innerHTML = '&#9654;'; // Change to play symbol HTML entity
            }
        });
    };

    // Function to create the try slideshow overlay
    const createTrySlideshowOverlay = (friendsImages, audioSrc) => {
        // Stop all audio before displaying overlay
        stopAllAudios();
    
        const overlay = document.createElement('div');
        overlay.classList.add('try-slideshow-overlay');
    
       
        const content = document.createElement('div');
        content.classList.add('trial-content');
        

    
        for (let i = 0; i < 3; i++) {
            const slideshow = document.createElement('div');
            slideshow.classList.add('trial-div');
            slideshow.style.animationDelay = `${i * 0}s`;
            content.appendChild(slideshow);
        
            
        }
        
    
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('trial-close');
        closeBtn.innerText = 'X';
        closeBtn.addEventListener('click', () => {
            clearInterval(interval);
            audio.pause();
            audio.currentTime = 0;
            overlay.remove();
        });
        content.appendChild(closeBtn);
    
        
        // Visualizer setup
        const visualizer = document.createElement('div');
        visualizer.classList.add('trial-visualizer');
        overlay.appendChild(visualizer);

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        
    
        // Start slideshow
        let index = 0;
        const slideshows = document.querySelectorAll('.trial-div');
        const animations = [
            'animation-1', 'animation-2', 'animation-3', 'animation-4', 
            'animation-5', 'animation-6', 'animation-7', 'animation-8', 
            'animation-9', 'animation-10'
        ];
    
        const applyAnimation = () => {
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            slideshows.forEach((slideshow, i) => {
                slideshow.classList.remove(...animations);
                slideshow.classList.add(randomAnimation);
                slideshow.style.backgroundImage = `url(${friendsImages[index % friendsImages.length]})`;
                slideshow.classList.remove('grayscale'); // Remove grayscale initially
            });
    
            // Apply grayscale effect to each div one by one
            slideshows.forEach((slideshow, i) => {
                setTimeout(() => {
                    slideshow.classList.add('grayscale');
                    setTimeout(() => {
                        slideshow.classList.remove('grayscale');
                    }, 3000); // Remove grayscale after 2 seconds
                }, i * 3000); // Delay in milliseconds between each div
            });
        };
    
        applyAnimation(); // Initial application of animation
    
        const interval = setInterval(() => {
            index++;
            applyAnimation();
    
            if (index >= friendsImages.length * 3) {
                clearInterval(interval);
                setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    overlay.remove();
                }, 8000); // Stop audio and close overlay after showing last image for 3 seconds
            }
        }, 8000);
    
        // Play audio
        const audio = new Audio(audioSrc);
        currentAudio = audio; // Set current audio to the newly created audio
        audio.play();
        audio.addEventListener('ended', () => {
            clearInterval(interval);
            setTimeout(() => {
                overlay.remove();
            }, 3000); // Close overlay after 3 seconds when audio ends
        });

         // Visualizer animation based on audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const drawVisualizer = () => {
            requestAnimationFrame(drawVisualizer);
            analyser.getByteFrequencyData(dataArray);

            // Clear previous visualization
            visualizer.innerHTML = '';

            // Draw new visualization
            const barWidth = (100 / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                const bar = document.createElement('div');
                bar.classList.add('visualizer-bar');
                bar.style.width = `${barWidth}%`;
                bar.style.height = `${barHeight}px`;
                bar.style.left = `${x}%`;
                visualizer.appendChild(bar);

                x += barWidth + 0.1; // Increase spacing between bars
            }
        };

        drawVisualizer();
    
    
    }
    // Event listener for Try buttons
    document.addEventListener('click', (event) => {
        const tryButton = event.target.closest('.all-button-container button:nth-of-type(2)');
        if (tryButton) {
            const songCard = tryButton.closest('.song-card');
            const audioSrc = songCard.querySelector('audio').src;

            // Fetch friends' images from localStorage
            const friendsImages = JSON.parse(localStorage.getItem('friends')).map(friend => friend.image);

            // Create and show try slideshow overlay
            createTrySlideshowOverlay(friendsImages, audioSrc);
        }
    });
});



//========================================================================================================================================
document.addEventListener('DOMContentLoaded', () => {
    const slideFriendsButton = document.getElementById('slide-friends');
    const selectedSongSection = document.querySelector('.selected-song');
    const friendCards = document.querySelectorAll('.friend-card');
   

    slideFriendsButton.addEventListener('click', () => {
        // Scroll to the "selected-song" section
        selectedSongSection.scrollIntoView({ behavior: 'smooth' });

        // Deselect all song cards and stop any playing audio in the selected-song section
        const selectedSongCards = selectedSongSection.querySelectorAll('.song-carded');
        selectedSongCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            const audio = card.querySelector('audio');
            const playButton = card.querySelector('.play-button'); // Add this line to select the play button

            if (checkbox) {
                checkbox.checked = false;
            }
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // Reset the audio to the start
                audio.loop = false; // Stop looping
            }
            if (playButton) {
                playButton.innerHTML = '&#9655;'; // Update the play button to show the play icon
            }
        });


        // Deselect all friend cards and hide checkboxes
        friendCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = false;
                // Hide the checkbox
                checkbox.style.display = 'none';
            }
        });
    });

});


//===================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const doneButtoned = document.getElementById('done-button');
    const palNameSpan = document.getElementById('pal-name');
    const friendHeading = document.getElementById('friend-heading'); // Reference to the h2 heading
    const fontPicker = document.querySelector('.font-picker');
    const fontOptions = fontPicker.querySelectorAll('.font-option');
    let selectedFont = 'Impact'; // Default font selection
    const fileLabel = document.querySelector('.file-label'); // Reference to the file label
    // Handle image upload and preview
    const addImageButton = document.getElementById('add-image');
    const imagePreview = document.getElementById('preview-image');


    const friends = JSON.parse(localStorage.getItem('friends')) || [
        { name: "Dwayne Joseph", img: "logo.ng" },
        { name: "Lydia Hialy", img: "logo.png" },
        { name: "Vin Mulinka", img: "logo.png" }
    ];

    const populateFriendsList = () => {
        const listOfPals = document.querySelector('.list-of-pals');
        listOfPals.innerHTML = ''; // Clear previous content
        friends.forEach(friend => {
            const palDiv = document.createElement('div');
            palDiv.className = 'pal';
            palDiv.innerHTML = `<img src="${friend.image}" alt="${friend.name}"><span>${friend.name}</span>`;
            palDiv.addEventListener('click', () => selectFriend(palDiv,  friend.name));
            listOfPals.appendChild(palDiv);
        });
    };

    const selectFriend = (palDiv, friendName) => {
        const pals = document.querySelectorAll('.pal');
        if (palDiv.classList.contains('selected')) {
            pals.forEach(pal => {
                pal.classList.remove('disabled');
            });
            palDiv.classList.remove('selected');
             palNameSpan.textContent = ''; // Clear friend's name
             friendHeading.textContent = 'Select one friend'; // Update heading text
            doneButtoned.disabled = true;
            fileLabel.classList.remove('disabled');
        } else {
            pals.forEach(pal => {
                if (pal !== palDiv) {
                    pal.classList.add('disabled');
                    
                }
            });
            palDiv.classList.add('selected');
            palNameSpan.textContent = friendName;
            friendHeading.textContent = `One word that describes your friend`; // Update heading text
            doneButtoned.disabled = false;
            fileLabel.classList.add('disabled'); // Disable the label
        }
    };

    const handleDoneButtonClick = () => {
        const input = document.getElementById('word-input').value.toUpperCase().replace(/[^\w\s]/gi, '');
        const errorMessage = document.getElementById('error-message');
        const doneButton = document.getElementById('done-button'); // Assuming the "Done" button has id 'done-button'
        const wordInput = document.getElementById('word-input');
        
        
        wordInput.addEventListener('input', () => {
            const inputValue = wordInput.value.trim();
            
            if (inputValue === '') {
                errorMessage.textContent = 'Please enter a word.';
                errorMessage.style.display = 'block';
                doneButton.disabled = true; // Disable the "Done" button
            } else {
                errorMessage.style.display = 'none';
                doneButton.disabled = false; // Enable the "Done" button
            }
        });
    
        wordInput.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                e.preventDefault(); // Prevent form submission or other default behavior
                handleDoneButtonClick(); // Call your function to handle "Done" button click
            }
        });


        if (input.trim().length === 0) { // Check if input is empty or only whitespace
            errorMessage.textContent = 'Please enter a word.';
            errorMessage.style.display = 'block';
            doneButton.disabled = true; // Disable the "Done" button
            return;
        } else {
            errorMessage.style.display = 'none';
            doneButton.disabled = false; // Enable the "Done" button
        }
    
        if (input.length > 25) {
            errorMessage.textContent = 'The word should be 25 characters or less and without punctuation.';
            errorMessage.style.display = 'block';
            doneButton.disabled = true; // Disable the "Done" button
            return;
        } else {
            errorMessage.style.display = 'none';
        }
    
        const selectedFriend = document.querySelector('.pal.selected');
        const selectedImage = document.getElementById('preview-image').querySelector('img');

        if (!selectedFriend && !selectedImage) {
            errorMessage.textContent = 'Please select a friend.';
            errorMessage.style.display = 'block';
            doneButton.disabled = true; // Disable the "Done" button
            return;
        } else {
            errorMessage.style.display = 'none';
        }
    
        const friendImg = selectedFriend ? selectedFriend.querySelector('img').src : selectedImage.src;

        const output = document.getElementById('output');
        output.innerHTML = ''; // Clear previous content
        
        fontOptions.forEach(option => {
            option.addEventListener('click', () => {
                selectedFont = option.dataset.font;
                fontOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        for (let char of input) {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            letterDiv.textContent = char;
            letterDiv.style.backgroundImage = `url(${friendImg})`;
            letterDiv.style.fontFamily = selectedFont; // Set the selected font for each letter
            output.appendChild(letterDiv);
        }
    
        // Add Download Magic button
        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-buttoned';
        downloadButton.textContent = 'Download Magic';
        downloadButton.addEventListener('click', handleDownloadButtonClick);
        output.appendChild(downloadButton);
    };
    
    
    const handleDownloadButtonClick = () => {
        const selectedFriend = document.querySelector('.pal.selected');
        const selectedImage = document.getElementById('preview-image').querySelector('img');
        const selectedSrc = selectedFriend ? selectedFriend.querySelector('img').src : selectedImage.src;
    
        if ((!selectedImage || selectedImage.src === '#') && !selectedFriend) {
            alert('No image selected or invalid image source.');
            return;
        }
    
        // Disable button or show loading indicator while waiting for image load
        const downloadButton = document.getElementById('download-buttoned');
        downloadButton.disabled = true;
        downloadButton.textContent = "Hold on";
        downloadButton.classList.add('disabled');
    
        const friendImg = new Image();
        friendImg.crossOrigin = "Anonymous";
        friendImg.onload = () => {
            const output = document.getElementById('output');
            const letters = Array.from(output.getElementsByClassName('letter'));
    
           // Increase letter size and canvas dimensions
        const fontSize = 80; // Increase font size
        const letterSpacing = 10; // Additional space between letters
        const canvasWidth = letters.reduce((acc, letter) => acc + letter.offsetWidth * 1.2 + letterSpacing, 0); // Increase canvas width with spacing
        const canvasHeight = letters[0].offsetHeight * 1.5; // Increase canvas height

            
            // Create the first canvas for black background
            const canvasBlackBg = document.createElement('canvas');
            const ctxBlackBg = canvasBlackBg.getContext('2d');
            canvasBlackBg.width = canvasWidth;
            canvasBlackBg.height = canvasHeight;
            canvasBlackBg.classList.add('canvas-bg');
            canvasBlackBg.dataset.type = 'blackBg';
    
            // Fill the first canvas with black color
            ctxBlackBg.fillStyle = 'black';
            ctxBlackBg.fillRect(0, 0, canvasBlackBg.width, canvasBlackBg.height);

             // Create the canvas with no outline on text
            const canvasNoOutline = document.createElement('canvas');
            const ctxNoOutline = canvasNoOutline.getContext('2d');
            canvasNoOutline.width = canvasWidth;
            canvasNoOutline.height = canvasHeight;
            canvasNoOutline.classList.add('canvas-bg');
            canvasNoOutline.dataset.type = 'noOutline';
    

            // Fill the canvas with white background for better visibility
            ctxNoOutline.fillStyle = 'white';
            ctxNoOutline.fillRect(0, 0, canvasNoOutline.width, canvasNoOutline.height);

    
            // Create the second canvas for friend's image background
            const canvasImageBg = document.createElement('canvas');
            const ctxImageBg = canvasImageBg.getContext('2d');
            canvasImageBg.width = canvasWidth;
            canvasImageBg.height = canvasHeight;
            canvasImageBg.classList.add('canvas-bg');
            canvasImageBg.dataset.type = 'imageBg';
    
    
            // Draw the friend's image as the background for the second canvas
            ctxImageBg.drawImage(friendImg, 0, 0, canvasImageBg.width, canvasImageBg.height);
    
            // Draw each letter on both canvases
            let xPos = 0;
            letters.forEach((letter, index) => {
                // Create a temporary canvas for each letter
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                const tempCanvasWidth = letter.offsetWidth * 1.2 + letterSpacing; // Include spacing
                tempCanvas.width = tempCanvasWidth;
                tempCanvas.height = canvasHeight;

                try {
                    // Draw the image on the temporary canvas
                    tempCtx.drawImage(friendImg, 0, 0, tempCanvas.width, tempCanvas.height);

                    // Set the font and text properties
                    const fontWeight = 'bolder'; // Adjust font weight
                    tempCtx.font = `${fontWeight} ${fontSize}px ${selectedFont}`;
                    tempCtx.textAlign = 'center';
                    tempCtx.textBaseline = 'middle';

                    // Draw the outline based on the background canvas type
                    if (tempCanvas === canvasBlackBg) {
                        // For black background canvas, don't draw outline
                        tempCtx.fillText(letter.textContent, tempCanvas.width / 2, tempCanvas.height / 2);
                    } else if (tempCanvas === canvasNoOutline){

                        tempCtx.strokeStyle = 'white'; // Outline color
                        tempCtx.lineWidth = 2; // Outline width
                        tempCtx.strokeText(letter.textContent, tempCanvas.width / 2, tempCanvas.height / 2);

                    } else {
                        // For image background canvas, draw outline
                        tempCtx.strokeStyle = 'black'; // Outline color
                        tempCtx.lineWidth = 2; // Outline width
                        tempCtx.strokeText(letter.textContent, tempCanvas.width / 2, tempCanvas.height / 2);

                        // Create a clipping path for the letter
                        tempCtx.globalCompositeOperation = 'destination-in';
                        tempCtx.fillText(letter.textContent, tempCanvas.width / 2, tempCanvas.height / 2);
                    }

                    
                    // Create a clipping path for the letter
                    tempCtx.globalCompositeOperation = 'destination-in';
                    tempCtx.fillText(letter.textContent, tempCanvas.width / 2, tempCanvas.height / 2);

                    // Optionally: Adjust shadow for better readability
                    tempCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                    tempCtx.shadowOffsetX = 1;
                    tempCtx.shadowOffsetY = 1;
                    tempCtx.shadowBlur = 2;

                    // Draw the clipped image on the main canvases
                    ctxBlackBg.drawImage(tempCanvas, xPos, 0);
                    ctxImageBg.drawImage(tempCanvas, xPos, 0);
                    ctxNoOutline.drawImage(tempCanvas, xPos, 0);
                    xPos += tempCanvasWidth; // Increase xPos with spacing
                } catch (e) {
                    console.error('DOMException while drawing:', e.message);
                    // Handle DOMException (e.g., show error message, disable button)
                    downloadButton.textContent = 'Try again later';
                    downloadButton.disabled = true; // Disable button on error
                }
            });

    
            // Create overlay for user confirmation
            const confirmOverlayDiv = document.createElement('div');
            confirmOverlayDiv.classList.add('confirm-overlayed');z

            // Create close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;'; // Close symbol (×)
            closeButton.classList.add('close-button');
            closeButton.addEventListener('click', () => {
                confirmOverlayDiv.remove(); // Remove the confirmation overlay on close button click
            });

            // Append close button to overlay
            confirmOverlayDiv.appendChild(closeButton);

            // Create elements to display and download images
            const divBlackBg = document.createElement('div');
            const imgBlackBg = new Image();
            imgBlackBg.src = canvasBlackBg.toDataURL('image/png');
            divBlackBg.appendChild(imgBlackBg);
            const buttonBlackBg = document.createElement('button');
            buttonBlackBg.textContent = 'Download.';
            buttonBlackBg.addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'magic-word.png';
                link.href = canvasBlackBg.toDataURL('image/png');
                link.click();
                confirmOverlayDiv.remove(); // Remove the confirmation overlay after download
            });
            divBlackBg.appendChild(buttonBlackBg);
            confirmOverlayDiv.appendChild(divBlackBg);

            const divImageBg = document.createElement('div');
            const imgImageBg = new Image();
            imgImageBg.src = canvasImageBg.toDataURL('image/png');
            divImageBg.appendChild(imgImageBg);
            const buttonImageBg = document.createElement('button');
            buttonImageBg.textContent = 'Download.';
            buttonImageBg.addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'magic-word-withbg.png';
                link.href = canvasImageBg.toDataURL('image/png');
                link.click();
                confirmOverlayDiv.remove(); // Remove the confirmation overlay after download
            });
            divImageBg.appendChild(buttonImageBg);
            confirmOverlayDiv.appendChild(divImageBg);
            

            const divNoOutline = document.createElement('div');
            const imgNoOutline = new Image();
            imgNoOutline.src = canvasNoOutline.toDataURL('image/png');
            divNoOutline.appendChild(imgNoOutline);
            const buttonNoOutline = document.createElement('button');
            buttonNoOutline.textContent = 'Download.';
            buttonNoOutline.addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'shaped-text-no-outline.png';
                link.href = canvasNoOutline.toDataURL('image/png');
                link.click();
                confirmOverlayDiv.remove(); // Remove the confirmation overlay after download
            });
            divNoOutline.appendChild(buttonNoOutline);
            confirmOverlayDiv.appendChild(divNoOutline);

            // Append overlay to document body
            document.body.appendChild(confirmOverlayDiv);

    
            // Enable the download button again after the operation is complete
            downloadButton.disabled = false;
            downloadButton.classList.remove('disabled');
    
            setTimeout(() => {
                downloadButton.textContent = 'Download Magic Word';
            }, 5000);
        };
    
        friendImg.onerror = (err) => {
            console.error('Error loading friend image:', err);
            // Handle the error (e.g., show error message, enable button again)
            downloadButton.textContent = 'Try again later';
            downloadButton.disabled = false; // Enable button on error
        };
    
        // Set the image source after onload and onerror handlers are defined to ensure proper handling
        friendImg.src = selectedSrc;
    };
    
       
    document.getElementById('done-button').addEventListener('click', handleDoneButtonClick);
    
  
    addImageButton.addEventListener('change', (e) => {
         const file = e.target.files[0];
         if (file) {
             const reader = new FileReader();
             reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    imagePreview.style.display = "block";
                    imagePreview.innerHTML = '';
                    imagePreview.appendChild(img);
                    handleDoneButtonClick(); // Trigger handleDoneButtonClick on image upload
                };
             };
             reader.readAsDataURL(file);
         }
    });

    // Initialize font picker
    fontOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedFont = option.dataset.font;
            fontOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Initialize
    populateFriendsList();



});



//=================================================================================================================================

//==================================================================================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    const canvas = document.getElementById('myCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });

    // Setup scene, camera, and objects
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Retrieve friends' images (assuming they are stored in localStorage)
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    const user = JSON.parse(localStorage.getItem('myself'));
    const userImage = user.image || 'logo2.png'; // Assuming user's image URL is stored separately
    const logoImage = 'logo.png'; // Replace with actual logo image path
    const magicalFriend = 'magic5.png';

    

    

    const emotions = {
        Joyful: '😊',
        Grateful: '🙏',
        Excited: '😃',
        Inspired: '🌟',
        Supportive: '🤝',
        Amused: '😂',
        Comforted: '🤗',
        Appreciative: '👍',
        Lovely: '💖',
        Cherished: '💝',
        Happy: '😁'
    };

    function getEmotionText(emotion) {
        const normalizedEmotion = emotion.trim().toLowerCase();
        const emotionKey = Object.keys(emotions).find(key => key.toLowerCase() === normalizedEmotion);
        return emotionKey ? `${emotions[emotionKey]} ${emotionKey} ${emotions[emotionKey]}` : `🙂 Just a Friend 🙂`;
    }
    // Create cubes for each image
    const cubes = [];
    const cubeSize = 4.0; // Larger size of each cube
    const spacing = 5.0; // Increased spacing between cubes

    // Add intro cubes
    const intro1Text = 'Magical Friend';
    const intro2Text = 'Presents';
    const intro3Text = `Art by ${user.facebookName}`;
    
    let downloadOverlayShown = false;
    let capturer; // Define the capturer variable

    // Add the magical friend cube first
    const magicalFriendTexture = new THREE.TextureLoader().load(magicalFriend);
    const magicalFriendGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const magicalFriendMaterial = new THREE.MeshBasicMaterial({ map: magicalFriendTexture });
    const magicalFriendCube = new THREE.Mesh(magicalFriendGeometry, magicalFriendMaterial);

    // Position the magical friend cube offscreen to the left
    magicalFriendCube.position.x = -(cubes.length * spacing);
    cubes.push(magicalFriendCube);
    scene.add(magicalFriendCube);

    // Intro cube 1
    const introCube1Texture = new THREE.CanvasTexture(createIntroTextTexture(intro1Text));
    const introCube1Geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const introCube1Material = new THREE.MeshBasicMaterial({ map: introCube1Texture, color: 'white' });
    const introCube1 = new THREE.Mesh(introCube1Geometry, introCube1Material);
    introCube1.position.x = -(cubes.length * spacing);
    cubes.push(introCube1);
    scene.add(introCube1);

    // Intro cube 2
    const introCube2Texture = new THREE.CanvasTexture(createIntroTextTexture(intro2Text));
    const introCube2Geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const introCube2Material = new THREE.MeshBasicMaterial({ map: introCube2Texture, color: 'red' });
    const introCube2 = new THREE.Mesh(introCube2Geometry, introCube2Material);
    introCube2.position.x = -((cubes.length * spacing) + cubeSize);
    cubes.push(introCube2);
    scene.add(introCube2);

    // Intro cube 3
    const introCube3Texture = new THREE.CanvasTexture(createIntroTextTexture(intro3Text));
    const introCube3Geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const introCube3Material = new THREE.MeshBasicMaterial({ map: introCube3Texture, color: 'white' });
    const introCube3 = new THREE.Mesh(introCube3Geometry, introCube3Material);
    introCube3.position.x = -((cubes.length * spacing) + cubeSize);
    cubes.push(introCube3);
    scene.add(introCube3);

    const userTexture = new THREE.TextureLoader().load(userImage);
    const userGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const userMaterial = new THREE.MeshBasicMaterial({ map: userTexture });
    const userCube = new THREE.Mesh(userGeometry, userMaterial);
    userCube.position.x = -((cubes.length * spacing) + cubeSize);
    cubes.push(userCube);
    scene.add(userCube);

    friends.forEach((friend, index) => {
        const image = friend.image;
        const emotion = friend.emotion || 'Just a Friend';
        const emotionText = `${friend.name}\n${getEmotionText(emotion)}`;
            
    
        // Create emotion cube
        const emotionTexture = new THREE.CanvasTexture(createEmotionTextTexture(emotionText));
        const emotionGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const emotionMaterial = new THREE.MeshBasicMaterial({ map: emotionTexture });
        const emotionCube = new THREE.Mesh(emotionGeometry, emotionMaterial);
    
        // Position emotion cube offscreen to the left, considering the spacing between cubes
        emotionCube.position.x = -((cubes.length * spacing) + cubeSize);
        cubes.push(emotionCube);
        scene.add(emotionCube);
    
        // Create friend image cube
        const texture = new THREE.TextureLoader().load(image);
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cube = new THREE.Mesh(geometry, material);
    
        // Position friend image cube offscreen to the left, considering the spacing between cubes
        cube.position.x = -((cubes.length * spacing) + cubeSize);
    
        cubes.push(cube);
        scene.add(cube);
    });

    const logoTexture = new THREE.TextureLoader().load(logoImage);
    const logoGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture });
    const logoCube = new THREE.Mesh(logoGeometry, logoMaterial);
    logoCube.position.x = -((cubes.length * spacing) + cubeSize);
    cubes.push(logoCube);
    scene.add(logoCube);


    // Add the stop cube with text "Magical Friend"
    const stopCubetext = `Top ${friends.length} friends. of ${user.facebookName}`;
    const stopCubeTexture = new THREE.CanvasTexture(createStopTextTexture(stopCubetext));
    const stopCubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const stopCubeMaterial = new THREE.MeshBasicMaterial({ map: stopCubeTexture, color: 'gold' });
    const stopCube = new THREE.Mesh(stopCubeGeometry, stopCubeMaterial);
    stopCube.position.x = -((cubes.length * spacing) + cubeSize);
    cubes.push(stopCube);
    scene.add(stopCube);

    // Function to handle window resize
    function onWindowResize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
    }

    // Event listener for window resize
    window.addEventListener('resize', onWindowResize);

    // Animation variables
    let animationId = null; // Store animation frame ID
    const slideSpeed = 0.02;
    let frameTimes = [];
    let audio = new Audio('y2mate.com - Hans Zimmer  Reunion Love Found Us.mp3'); // Replace with actual audio file path

    const audioContinua = [

        {src:"y2mate.com - 02 Hans Zimmer  Spirit Stallion of the Cimarron  Swimming.mp3", startAt:30},
        { src: 'y2mate.com - Hans Zimmer  Time Official Audio.mp3', startAt: 60 }, // Initial audio with start time
        { src: "y2mate.com - Crystal Skies  Release Me Lyrics feat Gallie Fisher.mp3", startAt: 20},
        { src: 'y2mate.com - Jim Yosef  Let You Go  Synthpop  NCS  Copyright Free Music.mp3', startAt: 30 }, // Example of another audio with start time
        // Add more audio tracks as needed
    ];
    
    let currentAudioIndex = 0; // Index to track the current audio in `audioContinua`

    

    // Animation function
    function animati() {
        animationId = requestAnimationFrame(animati);
        const counterProgress = document.querySelector('.overlay-counter');
        const computedStyle = window.getComputedStyle(counterProgress);
        
        const now = performance.now();
        frameTimes.push(now);

        

        // Slide all cubes
        cubes.forEach(cube => {
            cube.position.x += slideSpeed;
        });

        renderer.render(scene, camera);
        
        // Capture the frame if capturer is initialized
        if (capturer) {
            capturer.capture(canvas);
        }

        // Check if stopCube is in the center
        if (Math.abs(stopCube.position.x) < slideSpeed) {
            cancelAnimationFrame(animationId);
            animationId = null;
            pauseSlideshowAudio(); // Pause audio playback
            playButton.innerHTML = '&#9655;'; // Change button text to "Play"

            if (!downloadOverlayShown) {
                showDownloadOverlay();
                downloadOverlayShown = true;
            }

            if (computedStyle.getPropertyValue('display') === 'flex') {
                hideCounterProgress();
                pauseSlideshowAudio();

            }

            // Stop capturing and save the video
            if (capturer) {
                capturer.stop();
                capturer.save(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `magical_friend_${user.facebookName} _video.webm`; // Specify the name of the downloaded file
                    a.click();
                    showVideoOverlay(blob); // Display the downloaded video
                    hideCounterProgress();
                });
                capturer = null;
                cancelAnimationFrame(animationId);
            }

            audio.currentTime = 30;
        }


    }

    // Play / Pause button
    const playButton = document.getElementById('magic-play');
    
    audio.loop = true;
    let audioPlaying = false;
    let audioReady = false;
    let pausedAudioTime = 0;
    let slideshowStarted = false;
    let playCount = 0; // Initialize play count

    // Function to play the next audio track
    function playNextAudio() {
        currentAudioIndex++;
        if (currentAudioIndex >= audioContinua.length) {
            currentAudioIndex = 0; // Loop back to the first audio track
        }

        // Create or reset the audio element
        if (audio) {
            audio.pause(); // Pause current audio if exists
            audio.currentTime = 0; // Reset audio time
            audio.src = audioContinua[currentAudioIndex].src; // Set new source
            audio.currentTime = audioContinua[currentAudioIndex].startAt; // Set start time
        } else {
            audio = new Audio(audioContinua[currentAudioIndex].src); // Create new audio element
            audio.currentTime = audioContinua[currentAudioIndex].startAt; // Set start time
            audio.loop = true; // Enable looping for continuous play
            audio.addEventListener('ended', playNextAudio); // Listen for end of audio to play next
        }

        audio.play(); // Start playing the audio
    }


    playButton.addEventListener('click', function() {

        if (!areCubesAnimating()) {
            location.reload(); // Reload the page if cubes aren't animating
            return;
        }


        // Increment play count on each play button click
        playCount++;

        // Reset animation and audio for the first play or reload
        if (playCount === 1) {
            resetSlideshow(); // Reset the slideshow
            audio.currentTime = 60; // Start audio from 1 minute
            audioReady = false; // Reset audio readiness
            slideshowStarted = false; // Reset slideshow started flag
        }

        
        if (!animationId) {
            if (Math.abs(stopCube.position.x) < slideSpeed) {
                resetSlideshow(); // Reset the slideshow if the stopCube is in the center
            }
            if (!audioReady) {
                audio.addEventListener('loadedmetadata', function() {
                    audioReady = true;
                    playSlideshowAudio(!slideshowStarted); // Start audio playback from 1 minute
                    animati();
                    playButton.innerHTML = '&#9723;'; // Change button text to "Pause"
                    
                });
                audio.load(); // Start loading audio
            } else {
                animati(); // Start animation if audio is ready
                playSlideshowAudio(!slideshowStarted); // Start audio playback from 1 minute
                playButton.innerHTML = '&#9723;'; // Change button text to "Pause"
                
            }
        } else {
            cancelAnimationFrame(animationId); // Stop animation if already running
            animationId = null;
            pauseSlideshowAudio(); // Pause audio playback
            playButton.innerHTML = '&#9654;'; // Change button text to "Play"
            
        }



        slideshowStarted = true;
    });

    // Event listener for audio ended to play next track
    audio.addEventListener('ended', function() {
        if (animationId !== null) { // Check if animation is still running
            playNextAudio(); // Play the next audio track
        }
    });

    function playSlideshowAudio(startFromBeginning = false) {
        if (startFromBeginning) {
            audio.currentTime = 30; // Start audio playback from 30 seconds
        } else {
            audio.currentTime = pausedAudioTime; // Resume audio playback from the paused time
        }
        audio.play();
        audioPlaying = true;
    }

    function pauseSlideshowAudio() {
        pausedAudioTime = audio.currentTime; // Store the current time when audio is paused
        audio.pause();
        audioPlaying = false;
    }

    // Handle stall event to pause slideshow
    audio.addEventListener('stalled', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            playButton.innerHTML = '&#9655;'; // Change button text to "Play"
            
        }
    });

    // Function to check if cubes are animating
    function areCubesAnimating() {
        return cubes.some(cube => cube.position.x !== 0);
    }

    // Handle window focus change
    window.addEventListener('blur', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
            pauseSlideshowAudio(); // Pause audio playback
            playButton.innerHTML = '&#9655;'; // Change button text to "Play"
            capturer.stop();
            audio.pause();
        }
    });

    window.addEventListener('focus', function() {
        if (!animationId && audioPlaying) {
            animati(); // Resume animation if paused and audio is playing
            playButton.innerHTML = '&#9723;'; // Change button text to "Pause"
            capturer.start();
            playSlideshowAudio(!slideshowStarted)
        }
    });

    // Function to create text texture for stopCube
    function createStopTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        context.fillStyle = '#007bff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '48px "Comic Sans MS", cursive, sans-serif'; // Use a font that resonates with magic
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    
        const borderSize = 10;
        context.lineWidth = borderSize;
        context.strokeStyle = 'white';
        context.strokeRect(0, 0, canvas.width, canvas.height);
    
        // Split text into lines if it's too long
        const maxWidth = canvas.width - 2 * borderSize;
        const lines = wrapText(context, text, maxWidth);
        const lineHeight = 60; // Adjust line height as needed
    
        // Draw text
        lines.forEach((line, index) => {
            context.fillText(line, canvas.width / 2, (canvas.height / 2) - (lines.length / 2 * lineHeight) + (index * lineHeight));
        });
    
        return canvas;
    }

    // Function to create text texture for introCube
    function createIntroTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        context.fillStyle = '#007bff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = 'bold 48px Comic Sans MS'; // Simple white text for the intro cube
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    
        const borderSize = 10;
        context.lineWidth = borderSize;
        context.strokeStyle = 'white';
        context.strokeRect(0, 0, canvas.width, canvas.height);
    
        const maxWidth = canvas.width - 2 * borderSize;
        const lines = wrapText(context, text, maxWidth);
        const lineHeight = 60; // Adjust line height as needed
    
        // Draw text
        lines.forEach((line, index) => {
            context.fillText(line, canvas.width / 2, (canvas.height / 2) - (lines.length / 2 * lineHeight) + (index * lineHeight));
        });
    
        return canvas;
    }

    function createEmotionTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        context.fillStyle = '#007bff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = 'bold 48px Comic Sans MS';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    
        const borderSize = 10;
        context.lineWidth = borderSize;
        context.strokeStyle = 'white';
        context.strokeRect(0, 0, canvas.width, canvas.height);
    
        const maxWidth = canvas.width - 2 * borderSize;
        const lines = wrapText(context, text, maxWidth);
        const lineHeight = 60; // Adjust line height as needed
    
        // Draw text
        lines.forEach((line, index) => {
            context.fillText(line, canvas.width / 2, (canvas.height / 2) - (lines.length / 2 * lineHeight) + (index * lineHeight));
        });
    
        return canvas;
    }

    function wrapText(context, text, maxWidth) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];
    
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
     
    
    

    // Function to reset the slideshow
    function resetSlideshow() {
        cubes.forEach((cube, index) => {
            cube.position.x = -((index * spacing) + cubeSize);
        });

        pausedAudioTime = 0; // Reset paused audio time
        audio.currentTime = 30; // Reset audio to 30 seconds
        slideshowStarted = false;

         // Show download overlay if it's the first time
          
    }
    


    
    // Function to create and show download overlay
    function showDownloadOverlay() {
        
        const downloadDiv = document.getElementById('downloaddiv');
        const logoImage = document.getElementById('logoImage');
        const userImage = document.getElementById('userphoto');
        const downloadButton = document.getElementById('downloadButtoned');
        const closeButton = document.getElementById('closeButton');
        const agreeCheckbox = document.getElementById('agreeCheckbox');
        const userNameSpan = document.getElementById('userNames');
        
        // Retrieve user photo from localStorage
        const userData = JSON.parse(localStorage.getItem('myself'));
        if (userData && userData.image) {
            userImage.src = userData.image;
        } else {
            userImage.src = 'logo.png'; // Fallback if image is not available
        }


        if (userData && userData.facebookName) {
            userNameSpan.textContent = userData.facebookName;
        } else {
            userNameSpan.textContent = 'Lorem Ipsum';
        }
    
        logoImage.src = "magic5.png"; // Corrected the source file
        


        // Show overlay
        downloadDiv.style.display = 'flex';
        
        // Enable download button if checkbox is checked
        agreeCheckbox.addEventListener('change', function () {
            if (agreeCheckbox.checked) {
                downloadButton.disabled = false;
                agreeLabel.textContent = 'Agreed';
                agreeLabel.style.color = "gold";
            } else {
                downloadButton.disabled = true;
                agreeLabel.innerHTML = '<input type="checkbox" id="agreeCheckbox"> I agree';
                document.getElementById('agreeCheckbox').addEventListener('change', this);
            }
        });
    
        // Download button logic
        downloadButton.addEventListener('click', function() {
            if (!downloadButton.disabled) {
                const progressText = document.querySelector('.progressText');
                progressText.innerHTML += `<p>Thankyou, ${userData.facebookName} for being with Magical Friend</p>`;
                downloadDiv.style.display = 'none';
                showCounterProgress();
                capturer = new CCapture({
                    format: 'webm',
                    framerate: 60,
                    verbose: true,
                    quality: 100
                });

                // Start capturing frames
                capturer.start();

                resetSlideshow();
                animati();
                playSlideshowAudio();
                playButton.innerHTML = '&#9723;'; // Change button text to "Pause"
                

            }
        });
    
        // Close button logic
        closeButton.addEventListener('click', function() {
            downloadDiv.style.display = 'none';
        });
    }

    function showVideoOverlay(videoBlob) {
        const videoDiv = document.createElement('div');
        videoDiv.id = 'showVideoOverlay';
        videoDiv.style.position = 'fixed';
        videoDiv.style.top = '50%';
        videoDiv.style.left = '50%';
        videoDiv.style.transform = 'translate(-50%, -50%)';
        videoDiv.style.zIndex = '1000';
        videoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        videoDiv.style.padding = '20px';
        videoDiv.style.borderRadius = '10px';
        videoDiv.style.textAlign = 'center';
    
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.src = URL.createObjectURL(videoBlob);
        videoElement.style.width = '100%';
        videoElement.style.maxWidth = '600px';
        videoElement.style.borderRadius = '10px';
    
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(videoDiv);
        });
    
        videoDiv.appendChild(videoElement);
        videoDiv.appendChild(closeButton);
        document.body.appendChild(videoDiv);
    }

    // Function to show counter progress overlay
    function showCounterProgress() {
        const counterProgress = document.querySelector('.overlay-counter');
        counterProgress.style.display = 'flex'; // Show the overlay
    }

    // Function to show counter progress overlay
    function hideCounterProgress() {
        const counterProgress = document.querySelector('.overlay-counter');
        counterProgress.style.display = 'none'; // Show the overlay
    }
    
    
    });
//========================================================================================================================

document.addEventListener('DOMContentLoaded', function() {
    var memoriesCalendarEl = document.getElementById('memoriesCalendar');
    var eventsCalendarEl = document.getElementById('eventsCalendar');
    var customPromptModal = document.getElementById('customPromptModal');
    var customPromptInput = document.getElementById('customPromptInput');
    var customPromptConfirm = document.getElementById('customPromptConfirm');
    var customPromptCancel = document.getElementById('customPromptCancel');
    var memoryTitleEl = document.querySelector('.memory-title');
    var memoryInputEl = document.getElementById('memoryInput');
    var saveMemoryButton = document.getElementById('saveMemory');
    var memoriesListEl = document.getElementById('memoriesList');
    var onwnerMemoryname = document.getElementById('owner-names');
    var allowDateSelection = true; // Flag to control date selection
    var currentInfo;
    var currentCalendar;


    populateMemoriesFromLocalStorage();

    var usersName = JSON.parse(localStorage.getItem('myself'));
    onwnerMemoryname.textContent = usersName.facebookName;


    function showCustomPrompt(info, calendar) {
        customPromptModal.style.display = 'flex';
        customPromptInput.value = '';
        customPromptInput.focus();
        currentInfo = info;
        currentCalendar = calendar;
        allowDateSelection = false; // Disable date selection when prompt is shown
    }

    function hideCustomPrompt() {
        customPromptModal.style.display = 'none';
        currentInfo = null;
        currentCalendar = null;
    }

    customPromptConfirm.addEventListener('click', function() {
        var title = customPromptInput.value.trim();
        var chosenDate = currentInfo.start; // Get the chosen date from info.start
        var formattedChosenDate = chosenDate.toLocaleDateString('en-US');
        
        if (title && currentInfo && currentCalendar) {
            currentCalendar.addEvent({
                title: title,
                start: currentInfo.startStr,
                end: currentInfo.endStr,
                allDay: currentInfo.allDay
            });

            memoryTitleEl.innerHTML = formattedChosenDate +  " " +  title;
            
            
        }
        hideCustomPrompt();
    });

    customPromptCancel.addEventListener('click', function() {
        hideCustomPrompt();
        allowDateSelection = true;
    });

    var memoriesCalendar = new FullCalendar.Calendar(memoriesCalendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        select: function(info) {
            if (allowDateSelection && new Date(info.startStr) <= new Date()) {
                showCustomPrompt(info, memoriesCalendar);
            }
        },
        events: [
            // Add any predefined events here
        ]
    });

    var eventsCalendar = new FullCalendar.Calendar(eventsCalendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        select: function(info) {
            if (new Date(info.startStr) >= new Date()) {
                showCustomPrompt(info, eventsCalendar);
            }
        },
        events: [
            // Add any predefined events here
        ]
    });
    

    memoriesCalendar.render();
    eventsCalendar.render();

    // Enable save button only when there is input in memoryInputEl
    memoryInputEl.addEventListener('input', function() {
        saveMemoryButton.disabled = !memoryInputEl.value.trim();
    });

    // Function to populate memories from localStorage
    function populateMemoriesFromLocalStorage() {
        var existingMemories = JSON.parse(localStorage.getItem('memories')) || [];

        existingMemories.forEach(function(memory) {
            var memoryItem = document.createElement('div');
            memoryItem.classList.add('memory-item');

            // Memory Title
            var titleElement = document.createElement('h4');
            titleElement.textContent = memory.title;
            memoryItem.appendChild(titleElement);

            // Memory Content
            var contentElement = document.createElement('p');
            contentElement.textContent = memory.content;
            memoryItem.appendChild(contentElement);

            // Written Date
            var writtenDateElement = document.createElement('p');
            writtenDateElement.textContent = 'Memory Day: ' + memory.date;
            memoryItem.appendChild(writtenDateElement);

            // Current Date
            var currentDate = new Date().toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            var currentDateElement = document.createElement('p');
            currentDateElement.textContent = 'Updated: ' + new Date().toLocaleDateString() + ', ' + currentDate;
            memoryItem.appendChild(currentDateElement);

            const editDelContainer = document.createElement('div');
            editDelContainer.classList.add('edit-container');
            memoryItem.appendChild(editDelContainer);

            // Edit Icon
            var editIcon = document.createElement('span');
            editIcon.innerHTML = '✏️'; // Unicode for edit icon
            editIcon.classList.add('edit-icon');
            editIcon.addEventListener('click', function() {
                var query = "edit " + memory.title;
                confirmDeleteMemory(query);
            });
           editDelContainer.appendChild(editIcon);

            // Delete Icon
            var deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = '🗑️'; // Unicode for delete icon
            deleteIcon.classList.add('delete-icon');
            deleteIcon.addEventListener('click', function() {
                var query = "delete " +memory.title;
                confirmDeleteMemory(query);
            });
            editDelContainer.appendChild(deleteIcon);

            memoriesListEl.appendChild(memoryItem);
        });
    }



    // Function to save memory to localStorage
    function saveMemoryToLocalStorage(date, title, content) {
        // Retrieve existing memories from local storage
        var existingMemories = JSON.parse(localStorage.getItem('memories')) || [];

        // Create new memory object
        var newMemory = {
            date: date,
            title: title,
            content: content
        };

        // Add new memory to the array
        existingMemories.push(newMemory);

        // Save updated memories array back to local storage
        localStorage.setItem('memories', JSON.stringify(existingMemories));
    }


    // Save memory functionality
    document.getElementById('saveMemory').addEventListener('click', function() {
        var memoryText = memoryInputEl.value.trim();
        var memoryDate = memoryTitleEl.textContent.trim();


       // Separate date and text
        var memoryTitle = memoryTitleEl.textContent.trim(); // Get the text content of the element
        var spaceIndex = memoryTitle.indexOf(' ');
        var memoryDate = memoryTitle.substring(0, spaceIndex);
        var memoryContent = memoryTitle.substring(spaceIndex + 1);


        if (memoryText &&  memoryDate) {
            var memoryItem = document.createElement('div');
            memoryItem.classList.add('memory-item');

            // Memory Title
            var titleElement = document.createElement('h4');
            titleElement.textContent = memoryContent;
            memoryItem.appendChild(titleElement);

            // Memory Content
            var contentElement = document.createElement('p');
            contentElement.textContent = memoryText;
            memoryItem.appendChild(contentElement);

            // Written Date
            var writtenDateElement = document.createElement('p');
            writtenDateElement.innerHTML = '<strong>Memory Day:</strong> ' + memoryDate;
            memoryItem.appendChild(writtenDateElement);

            // Current Date
            var currentDate = new Date().toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            var currentDateElement = document.createElement('p');
            currentDateElement.innerHTML = '<b>Updated:</b> ' + new Date().toLocaleDateString() + ', ' + currentDate;
            memoryItem.appendChild(currentDateElement);

            const editDelContainer = document.createElement('div');
            editDelContainer.classList.add('edit-container');
            memoryItem.appendChild(editDelContainer);

            // Edit Icon
            var editIcon = document.createElement('span');
            editIcon.innerHTML = '✏️';
            editIcon.classList.add('edit-icon');
            editDelContainer.appendChild(editIcon);
            editIcon.addEventListener('click', function() {
                var query = "edit " + memoryContent;
                confirmDeleteMemory(query);
            });
            // Delete Icon
            var deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = '🗑️';
            deleteIcon.classList.add('delete-icon');
            editDelContainer.appendChild(deleteIcon);
            deleteIcon.addEventListener('click', function() {
                var query = "delete " + memoryContent ;
                confirmDeleteMemory(query);
            });

            memoriesListEl.appendChild(memoryItem);
            memoryInputEl.value = ''; // Clear the input field
            memoryTitleEl.textContent = ''; // Clear the memory title
            saveMemoryButton.disabled = true; // Disable the button again
            allowDateSelection = true; // Re-enable date selection after saving

            // Save memory to local storage
            saveMemoryToLocalStorage(memoryDate, memoryContent, memoryText);
            
            // Reload the current page
            window.location.reload();

        }
    });

    // Set reminder functionality
    document.getElementById('setReminder').addEventListener('click', function() {
        var reminderText = document.getElementById('reminderText').value;
        var reminderDate = document.getElementById('reminderDate').value;
        if (reminderText && reminderDate) {
            var alertItem = document.createElement('div');
            alertItem.textContent = reminderText + ' - ' + new Date(reminderDate).toLocaleString();
            document.getElementById('alertsList').appendChild(alertItem);
            document.getElementById('reminderText').value = ''; // Clear the input field
            document.getElementById('reminderDate').value = ''; // Clear the date field
        }
    });


    function confirmDeleteMemory(query) {
        var confirmTextElement = document.getElementById('confirmText');
        var confirmEditDelElement = document.getElementById('confirm-overlay');
        var memoriesListEl = document.getElementById('memoriesList');
        var existingMemories = JSON.parse(localStorage.getItem('memories')) || [];
    
        confirmTextElement.textContent = `Are you sure you want to ${query} this memory?`;
        confirmEditDelElement.style.display = 'block';
    
        var isDelete = query.trim().startsWith('delete');
    
        if (isDelete) {
            document.getElementById('confirmYes').onclick = function() {
                // Find the memory item to delete
                var memoryTitleToDelete = query.replace('delete ', '');
                var memoryItemToDelete = Array.from(memoriesListEl.getElementsByClassName('memory-item')).find(function(item) {
                    return item.querySelector('h4').textContent === memoryTitleToDelete;
                });
    
                // Remove from UI
                if (memoryItemToDelete) {
                    memoriesListEl.removeChild(memoryItemToDelete);
                }
    
                // Remove from localStorage
                existingMemories = existingMemories.filter(function(memory) {
                    return memory.title !== memoryTitleToDelete;
                });
                localStorage.setItem('memories', JSON.stringify(existingMemories));
    
                confirmEditDelElement.style.display = 'none';
            };
        } else if (query.trim().startsWith('edit')) {

            document.getElementById('confirmYes').onclick = function() {

            var memoryTitleToEdit = query.replace('edit ', '');
            var memoryToEdit = existingMemories.find(function(memory) {
                return memory.title === memoryTitleToEdit;
            });
    
            // Display edit form
            if (memoryToEdit) {
                var editForm = document.createElement('div');
                editForm.classList.add('edit-form');
                editForm.innerHTML = `
                     <input type="text" id="editMemoryTitle" value="${memoryToEdit.title}">
                    <textarea id="editMemoryContent">${memoryToEdit.content}</textarea>
                    <label for="editMemoryDate">Memory Date:</label>
                    <input type="date" id="editMemoryDate" value="${memoryToEdit.date}" max="${new Date().toISOString().split('T')[0]}">
                    <button id="editMemorySave">Save</button>
                    <button id="editMemoryCancel">Cancel</button>
                    <span class="edit-close">&times;</span>
                `;
                document.body.appendChild(editForm);
    
                // Save edited memory
                document.getElementById('editMemorySave').onclick = function() {
                    memoryToEdit.title = document.getElementById('editMemoryTitle').value.trim();
                    memoryToEdit.content = document.getElementById('editMemoryContent').value.trim();
    
                    // Update UI
                    
                    var memoryItemToUpdate = Array.from(memoriesListEl.getElementsByClassName('memory-item')).find(function(item) {
                        return item.querySelector('h4').textContent === memoryTitleToEdit;
                    });
                    if (memoryItemToUpdate) {
                        memoryItemToUpdate.querySelector('h4').textContent = memoryToEdit.title;
                        memoryItemToUpdate.querySelector('p').textContent = memoryToEdit.content;
                        memoryItemToUpdate.querySelector('p:nth-child(3)').innerHTML = `<strong>Memory Day:</strong> ${memoryToEdit.date}`;
                    }
    
                    // Update localStorage
                    localStorage.setItem('memories', JSON.stringify(existingMemories));
    
                    editForm.remove();
                    confirmEditDelElement.style.display = 'none';
                };
    
                // Cancel editing
                document.getElementById('editMemoryCancel').onclick = function() {
                    editForm.remove();
                    confirmEditDelElement.style.display = 'none';
                };
    
                // Close edit form
                editForm.querySelector('.edit-close').onclick = function() {
                    editForm.remove();
                    confirmEditDelElement.style.display = 'none';
                };
            }
        }
    }
    
        // Close confirmation dialog
        document.getElementById('confirmNo').onclick = function() {
            confirmEditDelElement.style.display = 'none';
        };
    }
    
    

    

    hideCustomPrompt();
});


//=====================================================================================================================================================

document.addEventListener('DOMContentLoaded', function() {
    const gridButton = document.getElementById('grid-memories');
    const columnButton = document.getElementById('column-memories');
    const memoriesList = document.getElementById('memoriesList');

    // Function to switch to grid layout
    gridButton.addEventListener('click', function() {
        memoriesList.classList.remove('column-layout');
        memoriesList.classList.add('grid-layout');
        setActiveButton(gridButton.querySelector('i'));
    });

    // Function to switch to column layout
    columnButton.addEventListener('click', function() {
        memoriesList.classList.remove('grid-layout');
        memoriesList.classList.add('column-layout');
        setActiveButton(columnButton.querySelector('i'));
    });

    // Function to set the active button
    function setActiveButton(activeIcon) {
        document.querySelectorAll('.sort-memories a i').forEach(icon => icon.classList.remove('active'));
        activeIcon.classList.add('active');
    }
});



//==========================================================================================================================================

document.addEventListener('DOMContentLoaded', function() {

    let memoriesShown = false;

    // Event listener for show-memory-slideshow button
    document.getElementById('show-memory-slideshow').addEventListener('click', function() {
            memoriesShown = !memoriesShown;
        
            const button = this;
        
            if (memoriesShown) {
                // Change button text to " ▲"
                button.innerHTML = 'magical memories ▲';
        
                // Show processing-memories while loading (simulated with a delay)
                document.querySelector('.processing-memories').classList.add('show');
        
                setTimeout(function() {
                    // Check the length of memories in local storage
                    const memories = JSON.parse(localStorage.getItem('memories')) || [];
                    const memoriesLength = memories.length;
        
                    const processingMessage = document.querySelector('.processing-message');
                    if (memoriesLength === 0) {
                        // Display message for 0 memories
                        processingMessage.textContent = 'You have 0 memories. Please add to see the magic.';
                        // Hide processing-memories after displaying the message
                        setTimeout(() => {
                            document.querySelector('.processing-memories').classList.remove('show');
                            button.innerHTML = 'magical memories ▼';
                            memoriesShown = false;
                        }, 3000); // Adjust loading time as needed
                    } else if (memoriesLength < 3) {
                        // Display message for less than 3 memories
                        processingMessage.textContent = 'You need at least 3 memories to see the magic.';
                        // Hide processing-memories after displaying the message
                        setTimeout(() => {
                            document.querySelector('.processing-memories').classList.remove('show');
                            button.innerHTML = 'magical memories ▼';
                            memoriesShown = false;
                        }, 3000); // Adjust loading time as needed
                    } else {
                        // Hide processing-memories after loading
                        document.querySelector('.processing-memories').classList.remove('show');
        
                        // Show magical-memories-view
                        document.querySelector('.magical-memories-view').classList.add('show');
        
                        // Start animation when memories are shown
                        animateMemories();
                    }
                }, 3000); // Adjust loading time as needed
            } else {
                // Change button text back to " ▼"
                button.innerHTML = 'magical memories ▼';
        
                // Hide magical-memories-view if memories are already shown
                document.querySelector('.magical-memories-view').classList.remove('show');
                memoriesShown = false;
            }
        });

        


        // Set up Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myMemories') });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Array to store cubes
        const cubes = [];

        // Create cubes with specific content
        const cubeWidth = 200; // Increased width for better text fitting
        const cubeHeight = 100; // Height remains the same
        const cubeDepth = 100; // Depth remains the same
        const spacing = 100; // Increased spacing between cubes
        
        function addCube(cube, index, hasText = false) {
            const startX = window.innerWidth / 4 + cubeWidth; // Adjusted starting position closer to the edge of the screen
            cube.position.x = startX + index * (cubeWidth + spacing); // Position cube off-screen to the right
            scene.add(cube);
            cubes.push(cube);

            // Set userData property for cubes with text
            if (hasText) {
                cube.userData.hasText = true;
            }
        }
        
       
        // Function to handle window resize and adjust cube sizes
        function handleResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);

            // Adjust cube positions and scale based on new window size
            const startX = width / 4 + cubeWidth; // Adjusted starting position closer to the edge of the screen
            cubes.forEach((cube, index) => {
                cube.position.x = startX + index * (cubeWidth + spacing);
                cube.scale.set(cubeWidth / 200, cubeHeight / 100, cubeDepth / 100); // Adjust scale relative to original cube dimensions
            });
        }

        // Initial setup for window resize handling
        handleResize();
        window.addEventListener('resize', handleResize);


        // Cube 1: Image (logo.png)
        const textureLoader = new THREE.TextureLoader();
        const logoTexture = textureLoader.load('magic5.png'); // Replace with actual path
        const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture });
        const cube1 = new THREE.Mesh(new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth), logoMaterial);
        addCube(cube1, 0);

        // Cube 2: Text ("Presents")
        const text2 = createTextMesh("Presents");
        addCube(text2, 1);

        // Cube 3: Image (from localStorage)
        const myself = JSON.parse(localStorage.getItem('myself'));
        if (myself && myself.image) {
            const imageTexture = textureLoader.load(myself.image);
            const imageMaterial = new THREE.MeshBasicMaterial({ map: imageTexture });
            const cube3 = new THREE.Mesh(new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth), imageMaterial);
            addCube(cube3, 2);
        }

        // Cubes 4+: Memories (from localStorage)
        const memories = JSON.parse(localStorage.getItem('memories')) || [];
        const startTextIndex = 3; // Start placing text cubes after cubes 1, 2, 3

        memories.forEach((memory, index) => {
            const memoryCube = createMemoryCube(memory.title, memory.content); // Create memory cube
            const dateCube = createDateCube(memory.date); // Create date cube
            addCube(dateCube, startTextIndex + index * 2); // Position date cube before memory cubes
            addCube(memoryCube, startTextIndex + index * 2 + 1, true); // Position memory cube after date cube
        });

        // Cube (Last): Image (magic5.png)
        const logo2Texture = textureLoader.load('logo.png'); // Replace with actual path
        const logo2Material = new THREE.MeshBasicMaterial({ map: logo2Texture });
        const cubeLast = new THREE.Mesh(new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth), logo2Material);
        addCube(cubeLast, startTextIndex + memories.length * 2); // Adjusted index to account for both date and memory cubes


        camera.position.z = 200; // Adjust camera position for better visibility

        // Function to create text mesh using CanvasTexture
        function createTextMesh(text, font = 'bold 72px Comic Sans MS', color = 'white') {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const size = 2048; // Increased canvas size for better resolution

            canvas.width = size / 2;
            canvas.height = size / 4; // Aspect ratio adjusted for wider text

            // No background color needed, transparent canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Text styling
            context.fillStyle = color; // Text color
            context.font = font; // Font and size
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            // Split text into lines for better wrapping
            const lines = splitTextIntoLines(text, 20); // Adjust line length as needed

            // Display each line of text
            const lineHeight = 100; // Adjust line height as needed
            const startY = (canvas.height - lines.length * lineHeight) / 2;

            lines.forEach((line, index) => {
                context.fillText(line, canvas.width / 2, startY + index * lineHeight);
            });

            // Create CanvasTexture from the canvas
            const texture = new THREE.CanvasTexture(canvas);

            // Optionally, set texture properties for better rendering quality
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            // Create a material with the texture
            const material = new THREE.MeshBasicMaterial({ map: texture });

            // Create a box geometry for the mesh
            const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);

            // Create the mesh using the geometry and material
            const mesh = new THREE.Mesh(geometry, material);

            return mesh;
        }

        // Function to split text into lines for better wrapping
        function splitTextIntoLines(text, maxLineLength) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
        
            words.forEach(word => {
                // If a single word is longer than the maxLineLength, truncate it
                if (word.length > maxLineLength) {
                    const truncatedWord = word.substring(0, maxLineLength - 3) + '...';
                    if (currentLine.length > 0) {
                        lines.push(capitalizeFirstLetter(currentLine.trim())); // Capitalize and push current line
                        currentLine = '';
                    }
                    lines.push(truncatedWord);
                } else {
                    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
                    if (testLine.length <= maxLineLength) {
                        currentLine = testLine;
                    } else {
                        lines.push(capitalizeFirstLetter(currentLine.trim())); // Capitalize and push current line
                        currentLine = word;
                    }
                }
            });
        
            if (currentLine.length > 0) {
                lines.push(capitalizeFirstLetter(currentLine.trim())); // Capitalize and push current line
            }
        
            return lines;
        }
        
        // Function to capitalize the first letter of a string
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        

        // Function to create memory cube with date and content
        function createMemoryCube(title, content) {
            // Create cube geometry and main material
            const cubeGeometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'blue' }); // Main color material

            // Create cube mesh
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            // Create a colorful border material (using ShaderMaterial)
            const borderShaderMaterial = new THREE.ShaderMaterial({
                uniforms: {},
                vertexShader: `
                    varying vec3 vPos;
                    void main() {
                        vPos = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vPos;
                    void main() {
                        float thickness = 0.02; // Adjust border thickness
                        vec3 color1 = vec3(0.8, 0.2, 0.2); // Soft Red
                        vec3 color2 = vec3(0.2, 0.8, 0.2); // Soft Green
                        vec3 color3 = vec3(0.2, 0.2, 0.8); // Soft Blue
                        vec3 color4 = vec3(0.8, 0.8, 0.2); // Soft Yellow
                        vec3 color5 = vec3(0.8, 0.2, 0.8); // Soft Purple
                        vec3 color = mix(color1, color2, step(0.2, fract(vPos.x * 5.0 + vPos.y * 5.0 + vPos.z * 5.0)));
                        color = mix(color, color3, step(0.4, fract(vPos.x * 5.0 - vPos.y * 5.0 + vPos.z * 5.0)));
                        color = mix(color, color4, step(0.6, fract(vPos.x * 5.0 + vPos.y * 5.0 - vPos.z * 5.0)));
                        color = mix(color, color5, step(0.8, fract(vPos.x * 5.0 - vPos.y * 5.0 - vPos.z * 5.0)));
                        gl_FragColor = vec4(color, thickness);
                    }
                `,
                side: THREE.BackSide // Render border as back face
            });

            // Create a slightly larger cube for the border effect
            const borderCube = new THREE.Mesh(cubeGeometry, borderShaderMaterial);
            borderCube.scale.multiplyScalar(1.05); // Scale slightly larger than the main cube
            cube.add(borderCube); // Add the border cube as a child of the main cube

            
            
            const titleText = createTextMesh(`${title}`, 'bold 72px Comic Sans MS', 'gold');
            titleText.position.y = cubeHeight / 2 + 10; // Adjust position
            cube.add(titleText);

            // Create text mesh for content
            // Split content into words
            const words = content.split(' ');

            // Take the first 20 words
            const visibleWords = words.slice(0, 20).join(' ');

            // Truncate the rest if content exceeds 20 words
            const truncatedContent = visibleWords + (words.length > 20 ? '...' : '');

            // Format truncated content to uppercase first letter of each line
            const formattedContent = truncatedContent.split('\n').map(line => line.charAt(0).toUpperCase() + line.slice(1)).join('\n');

            // Create text mesh for content
            const contentText = createTextMesh(formattedContent, 'bold 72px Comic Sans MS', 'white');
            contentText.position.y = 0; // Center position
            cube.add(contentText);
        
            return cube;
        }

        // Function to create date cube
        function createDateCube(date) {
            // Create cube geometry and main material
            const cubeGeometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'blue' }); // Main color material

            // Create cube mesh
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            // Create a colorful border material (using ShaderMaterial)
            const borderShaderMaterial = new THREE.ShaderMaterial({
                uniforms: {},
                vertexShader: `
                    varying vec3 vPos;
                    void main() {
                        vPos = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vPos;
                    void main() {
                        float thickness = 0.02; // Adjust border thickness
                        vec3 color1 = vec3(0.8, 0.2, 0.8); // Soft Red
                        vec3 color2 = vec3(0.2, 0.8, 0.2); // Soft Green
                        vec3 color3 = vec3(0.2, 0.2, 0.8); // Soft Blue
                        vec3 color4 = vec3(0.8, 0.8, 0.2); // Soft Yellow
                        vec3 color5 = vec3(0.8, 0.2, 0.8); // Soft Purple
                        vec3 color = mix(color1, color2, step(0.2, fract(vPos.x * 5.0 + vPos.y * 5.0 + vPos.z * 5.0)));
                        color = mix(color, color3, step(0.4, fract(vPos.x * 5.0 - vPos.y * 5.0 + vPos.z * 5.0)));
                        color = mix(color, color4, step(0.6, fract(vPos.x * 5.0 + vPos.y * 5.0 - vPos.z * 5.0)));
                        color = mix(color, color5, step(0.8, fract(vPos.x * 5.0 - vPos.y * 5.0 - vPos.z * 5.0)));
                        gl_FragColor = vec4(color, thickness);
                    }
                `,
                side: THREE.BackSide // Render border as back face
            });

            // Create a slightly larger cube for the border effect
            const borderCube = new THREE.Mesh(cubeGeometry, borderShaderMaterial);
            borderCube.scale.multiplyScalar(1.05); // Scale slightly larger than the main cube
            cube.add(borderCube); // Add the border cube as a child of the main cube

            // Create text mesh for date
            const formattedDate = formatDate(date);
            const dateText = createTextMesh(`${formattedDate}`, 'bold 72px Comic Sans MS', 'cyan');
            dateText.position.y = 0; // Position below the cube
            cube.add(dateText);

            return cube;
        }

        function formatDate(dateString) {
            const dateParts = dateString.split('/');
            const day = parseInt(dateParts[1], 10); // Assuming day is the second part of the date
            const monthIndex = parseInt(dateParts[0], 10) - 1; // Assuming month is the first part of the date (adjusting for 0-based index)
            const year = parseInt(dateParts[2], 10);
        
            // Create a date object
            const date = new Date(year, monthIndex, day);
        
            // Format the date to "8 July 2024" format
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
        
            return formattedDate;
        }

        

        let isPlayingMemories = false;
        let animationId = null;
        let cubeLastReachedCenter = false;
        let previousTimestamp = 0;
        let lagThreshold = 1; // Threshold in milliseconds to consider as lag
        // Animation speed (adjust as needed)
        const animationSpeed = 0.4;
        let audio = document.getElementById('default-song'); // Default song audio element
        //audio.loop = true;
        let isCustomSongPlaying = false;
        // Initialize audio index for audioJoiner array
        let audioIndex = 0; 


        const adioJoiner = [
            { audio:"y2mate.com - How Does A Moment Last Forever  Celine Dion Lyrics.mp3", timeToStart:8 },
            { audio: "y2mate.com - Crystal Skies  Release Me Lyrics feat Gallie Fisher.mp3", timeToStart:23 },
            { audio: "y2mate.com - Diviners  Savannah feat Philly K  Tropical House  NCS  Copyright Free Music.mp3", timeToStart: 116 },
            { audio: "y2mate.com - Diviners Riell  Slow Official Lyric Video.mp3", timeToStart:122},
            { audio: "y2mate.com - Culture Code  Make Me Move feat Karra  Dance Pop  NCS  Copyright Free Music.mp3", timeToStart:120},
            { audio: "y2mate.com - John Powell  Hans Zimmer  Homeland  Spirit.mp3", timeToStart: 212 },
            
        ];


        // Function to enable the Show Overlay button
        function enableShowOverlayButton() {
            const showOverlayButton = document.getElementById('showOverlayButton');
            showOverlayButton.style.display = 'block';
            showOverlayButton.disabled = false;
        }

        function DisableShowOverlayButton() {
            const showOverlayButton = document.getElementById('showOverlayButton');
            showOverlayButton.style.display = 'none';
            showOverlayButton.disabled = false;
        }

        // Animation loop
        function animate() {
            animationId = requestAnimationFrame(animate);

            if (!isPlayingMemories) {
                return; // Stop animation if not playing
            }

            let allCubesOffScreen = true;

            cubes.forEach((cube) => {
                // Move each cube leftwards
                cube.position.x -= animationSpeed;

                // Check if the cube has text (assuming cubes with text have a userData property)
               
                if (cube.userData.hasText) {
                    cube.rotation.y += animationSpeed * 0.01; // Base rotation speed
                
                    // Further adjust rotation speed if needed
                    cube.rotation.y *= 0.95; // Adjust rotation speed dynamically
                }
                

                // Check if any cube is still on the screen
                if (cube.position.x + cubeWidth / 2 > 0) {
                    allCubesOffScreen = false;
                }

                // Check if cubeLast reaches the center
                if (cube === cubeLast && cube.position.x <= 0 && !cubeLastReachedCenter) {
                    cubeLastReachedCenter = true;
                    cancelAnimationFrame(animationId); // Pause animation
                    audio.pause(); // Pause audio
                    audio.currentTime = 0;
                    updatePlayButton(); // Update play button UI
                    enableSongList();
                    enableShowOverlayButton();
                }
            });

            renderer.render(scene, camera);

            if (allCubesOffScreen) {
                cubeLastReachedCenter = false; // Reset the flag when all cubes are off screen
            }
        }


        
        // Event listener for play button
        const playButton = document.getElementById('play-memories');
        

        // Update play button UI based on animation state
        function updatePlayButton() {
            if (isPlayingMemories) {
                playButton.innerHTML = "&#9654;"; // Unicode for play symbol
            } else {
                playButton.innerHTML = "&#10074;&#10074;"; // Unicode for pause symbol
            }
        }

        // Update play button to reload icon and cancel animation
        function updatedPlayButton() {
            playButton.innerHTML = "&#8635;"; // Unicode for reload symbol
            cancelAnimationFrame(animationId); // Cancel the animation frame
            audio.pause();
        }

        playButton.addEventListener('click', () => {
            if (playButton.innerHTML === "&#8635;") {
                window.location.reload(true); // Reload the page ignoring cached resources
            }
        });

        function notifyUsers(message) {
            const notificationContainer = document.getElementById('notificationed-container');
            const notificationMessage = document.getElementById('notificationed-message');
        
            // Set the message content
            notificationMessage.textContent = message;
        
            // Show the notification
            notificationContainer.classList.add('show');
        
            // Automatically hide after 3 seconds (adjust timing as needed)
            setTimeout(() => {
                notificationContainer.classList.remove('show');
            }, 6000);
        }

        // Event listener for audio stalled event
        audio.addEventListener('stalled', updatedPlayButton);

        // Event listener for audio metadata loading error
        audio.addEventListener('error', updatedPlayButton);
        audio.addEventListener('ended', () => {
            notifyUsers("Audio ended");
        
            if (isPlayingMemories) {
                if (audioIndex < adioJoiner.length) {
                    const nextAudio = adioJoiner[audioIndex];
                    audio.src = nextAudio.audio;
                    audio.currentTime = nextAudio.timeToStart;
                    audio.play();
                    audioIndex++;
                    isCustomSongPlaying = true;
                    notifyUsers(`Switched to ${nextAudio.audio}...`);
                } else {
                    audio.src = document.getElementById('default-song').src;
                    audio.currentTime = 212;
                    audio.loop = true;
                    audio.play();
                    isCustomSongPlaying = false;
                    notifyUsers('Switched to default song...');
                }
            } else {
                notifyUsers('We hoped you enjoyed...');
            }

        });
        
        audio.addEventListener('playing',() => {
            setTimeout(("Song Playing..."),notifyUsers,2000)
        })

        playButton.addEventListener('click', () => {
            if (!isPlayingMemories) {
                if (cubeLastReachedCenter) {
                    // Reset animation state for cubeLast and start animation from the beginning
                    cubes.forEach((cube, index) => {
                        const startX = window.innerWidth / 4 + cubeWidth;
                        cube.position.x = startX + index * (cubeWidth + spacing) + 100;
                    });
                    cubeLastReachedCenter = false;
                
                    // Reset audio playback time to 0 only if it's the initial start
                    if (audio.currentTime === 0) {
                        audio.currentTime = 0;
                    }
                }

                // Start animation
                animate();

                // Check for animation lag
                if (previousTimestamp > 0) {
                    let elapsedTime = performance.now() - previousTimestamp;
                    if (elapsedTime > lagThreshold) {
                        updatedPlayButton();
                        return;
                    }
                }

                previousTimestamp = performance.now();
              
                // Play selected song after a delay if it's the initial start
                if (audio.currentTime === 0) {
                    setTimeout(playSelectedSong, 5000);
                } else {
                    // Otherwise, play immediately from the stored currentTime
                    playSelectedSong();
                }

                playButton.innerHTML = "&#10074;&#10074;"; // Unicode for pause symbol
                
                // Disable song list while playing
                disableSongList(true);
                DisableShowOverlayButton();

                isPlayingMemories = true;
            } else {
                // Pause animation
                cancelAnimationFrame(animationId);
                // Check if audio is playing and store current time
                if (!audio.paused) {
                    audio.dataset.currentTime = audio.currentTime;
                }
                
                audio.pause(); // Pause audio
                playButton.innerHTML = "&#9654;"; // Unicode for play symbol
                // Remove lagging check
                previousTimestamp = 0;
                enableSongList()
                isPlayingMemories = false;
            }
        });
        

        

        // Function to play the selected song
        function playSelectedSong() {

            
            // Check if the user uploaded a song
            const chosenSong = document.getElementById('chosen-song').files[0];
            
            if (chosenSong) {
                audio.src = URL.createObjectURL(chosenSong);
                isCustomSongPlaying = true; // Set flag for custom song
                notifyUsers(`Playing... ${chosenSong.name}`);
            } else {
                // Check if a song from the other song list is selected
                const selectedSong = document.querySelector('.other-songs li.selected');
                if (selectedSong) {
                    audio.src = selectedSong.dataset.song;
                    
                    isCustomSongPlaying = true; // Set flag for custom song
                    notifyUsers(`Playing... ${selectedSong.textContent}`);
                } else {
                    // Use the default song if no other song is selected
                    audio.src = document.getElementById('default-song').src;
                    
                    isCustomSongPlaying = false; // Set flag for custom song
                    notifyUsers(`Now playing... `);
                }
            }

             // Play at the stored currentTime if available
            if (audio.dataset.currentTime) {
                audio.currentTime = parseFloat(audio.dataset.currentTime);
                delete audio.dataset.currentTime; // Remove stored time after use
            }

            

            audio.play();
        }
        
 
       
        

        // Event listener for chosen song input change
        document.getElementById('chosen-song').addEventListener('change', () => {
            const chosenSong = document.getElementById('chosen-song').files[0];
            if (chosenSong) {
                const songList = document.querySelector('.other-songs ul');
                const newSongItem = document.createElement('li');
                newSongItem.textContent = chosenSong.name;
                newSongItem.dataset.song = URL.createObjectURL(chosenSong);
                newSongItem.classList.add('uploaded');
                songList.appendChild(newSongItem);
                toggleSongListState(); // Ensure the new item complies with the current state
            }
            document.querySelector('.othersong-overlay').classList.remove('show');

        });

        // Function to enable the song list
        function enableSongList() {
            const songListItems = document.querySelectorAll('.other-songs li');
            songListItems.forEach(item => {
                item.style.pointerEvents = 'auto';
            });
        }
        // Function to disable or enable the song list
        function disableSongList(disable) {
            const songListItems = document.querySelectorAll('.other-songs li');
            songListItems.forEach(item => {
                item.style.pointerEvents = disable ? 'none' : 'auto';
            });
        }


        // Function to toggle the state of song list items based on the current disable/enable state
        function toggleSongListState() {
            const songListItems = document.querySelectorAll('.other-songs li');
            songListItems.forEach(item => {
                item.style.pointerEvents = isPlayingMemories ? 'none' : 'auto';
            });
        }

        // Add click event to other song list items to select a song
        document.querySelectorAll('.other-songs li').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.other-songs li').forEach(li => li.classList.remove('selected'));
                item.classList.add('selected');
                document.querySelector('.othersong-overlay').classList.remove('show');
                
            });

    });

    // Show the song selection elements when the animation reaches the last cube
        // Function to show the song selection overlay
        function showSongSelection() {
            document.querySelector('.othersong-overlay').classList.add('show');
        }

        

        // Event listener for closing the overlay
        document.getElementById('closeOtherOverlay').addEventListener('click', () => {
            document.querySelector('.othersong-overlay').classList.remove('show');
        });

        // Event listener for the manual show button
        document.getElementById('showOverlayButton').addEventListener('click', showSongSelection);
});

//===============================================================================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("magic-friend-about");
    const closeBtn = document.getElementById("closeBtn");
    const friendImage = document.getElementById("friendImage");
    const friendName = document.getElementById("friendName");
    const friendEmotion = document.getElementById("friendEmotion");
    const friendDescription = document.getElementById("friendDescription");
    const characterDisplay = document.getElementById("characterDisplay");

    let searchQuery = "";
    let isInputActive = false;

    const friendEmotions = {
        Joyful: '😊',
        Grateful: '🙏',
        Excited: '😃',
        Inspired: '🌟',
        Supportive: '🤝',
        Amused: '😂',
        Comforted: '🤗',
        Appreciative: '👍',
        Lovely: '💖',
        Cherished: '💝',
        Happy: '😁'
    };


    searchIcon.addEventListener("click", () => {
        if (!isInputActive) {
            const searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.id = "searchInput";
            searchInput.className = "search-input";
            searchInput.placeholder = "Type to search for a friend...";

            characterDisplay.appendChild(searchInput);
            searchInput.focus();
            isInputActive = true;

            searchInput.addEventListener("blur", () => {
                resetSearch();
            });

            searchInput.addEventListener("input", () => {
                searchQuery = searchInput.value.trim().toLowerCase();
                updateFriendDetails();
            });
            
        } else {

            characterDisplay.removeChild(searchInput);
            isInputActive = false;
            resetSearch();
        }
    });

    function resetSearch() {
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            characterDisplay.removeChild(searchInput);
        }
        isInputActive = false;
        searchQuery = "";
        overlay.style.display = "none";
    }

    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
        searchQuery = ""; // Reset the search query when the overlay is closed
        characterDisplay.textContent = "";
    });

    


    document.addEventListener("keypress", (event) => {
        if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA" && document.activeElement.id === "searchInput") {
            const char = event.key;
            if (char === 'Enter') {
                searchQuery = "";
                characterDisplay.textContent = "";
                overlay.style.display = "none";
                return;
            } else if (char === ' ') {
                // Ignore space characters
                return;
            }

            searchQuery += char.toLowerCase();
            characterDisplay.textContent = searchQuery;

            console.log(searchQuery);
            updateFriendDetails();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA" && document.activeElement.id === "searchInput") {
            if (event.key === "Backspace" || event.key === "Delete") {
                searchQuery = searchQuery.slice(0, -1);
                characterDisplay.textContent = searchQuery;

                
                updateFriendDetails();
            }
        }
    });

    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
        searchQuery = ""; // Reset the search query when the overlay is closed
        characterDisplay.textContent = "";
    });

    function updateFriendDetails() {
        const friends = JSON.parse(localStorage.getItem("friends"));
        const foundFriend = friends.find(friend =>
            friend.name.toLowerCase().includes(searchQuery)
        );

        if (foundFriend) {
            friendImage.src = foundFriend.image;
            friendName.textContent = foundFriend.name;
            const normalizedEmotion = foundFriend.emotion.trim().toLowerCase();
            const emotionKey = Object.keys(friendEmotions).find(key => key.toLowerCase() === normalizedEmotion);
            const displayedEmotion = emotionKey ? `${friendEmotions[emotionKey]} ${emotionKey}` : `🙂 Just a Friend 🙂`;
            friendEmotion.innerHTML = `How i feel about ${foundFriend.name}<br>${displayedEmotion}`;
            friendDescription.textContent = foundFriend.description;
            overlay.style.display = "flex";
        } else {
            overlay.style.display = "none";
        }
    }
});

  

//==================================================================================================================================

document.addEventListener('DOMContentLoaded', function() {
    const friends = JSON.parse(localStorage.getItem('friends')) || [];

    // Extract names and images from the friends array
    const friendDetails = friends.map(friend => ({ name: friend.name, image: friend.image }));

    const questions = [
        { question: "Do you have any other names or aliases?", type: "text", placeholder: "(e.g., Joe, Xi, Kumar, Nala)", required: true },
        { question: "What is your gender?", type: "select", options: ["Other", "Male", "Female"], required: true },
        { question: "What is your birth date?", type: "date", required: true },
        { question: "What is your country of birth?", type: "text", placeholder: "(e.g., moscow, Russia)", required: true },
        { question: "Raised in a family of (siblings)?", type: "number", required: true },
        { question: "What is your marital status", type: "select", options: ["Single", "Married", "Unknown"], required: true },
        { question: "What is your favorite color?", type: "text", placeholder: "(e.g., Blue, Green)", required: true },
        { question: "What is your favorite book?", type: "text", placeholder: "(e.g., The Jungle Book, Hamlet)", required: true },
        { question: "What is your profession?", type: "text", placeholder: "(e.g., Teacher, Engineer)", required: true },
        { question: "What is your favorite number?", type: "number", required: true },
        { question: "What is your hobby or favorite activity?", type: "text", placeholder: "(e.g., Fishing, Painting)", required: true },
        { question: "What are your interests in your career?", type: "text", placeholder: "(e.g., Research, Innovation)", required: true },
        { question: "What is your belief or principle based on?", type: "select", options: ["Christianity", "Islam", "Hinduism", "Buddhism", "Judaism", "Atheism", "Daoism", "Other"], required: true },
        { question: "What is your source of inspiration?", type: "text", placeholder: "(e.g., Nature, Family)", required: true },
        { question: "What is your contribution or goal?", type: "text", placeholder: "(e.g., Helping others, Environmental conservation)", required: true },
        { question: "What is your significant achievement?", type: "text", placeholder: "(e.g., Nobel Prize, Record achievement)", required: true },
        { question: "Who is your best friend?", type: "select", options: friendDetails.map(friend => friend.name), required: true },
        { question: "What are your top 3 friends?", type: "checkbox", options: friendDetails, required: true },
        { question: "What is your favorite movie?", type: "text", placeholder: "(e.g., Inception, Titanic)", required: true },
        { question: "What is your favorite food?", type: "text", placeholder: "(e.g., Pizza, Sushi)", required: true },
        { question: "What is your dream vacation destination?", type: "text", placeholder: "(e.g., Paris, Maldives)", required: true },
        { question: "What is your favorite sport?", type: "text", placeholder: "(e.g., Soccer, Basketball)", required: true },
    
    ]; 
    

    let currentQuestionIndex = 0;
    let answers = {};
    let selectedFriends = [];
    
    const answerInputContainer = document.getElementById('answer-input');
    const questionDisplay = document.getElementById('question-display');
    const okButton = document.getElementById('ok-btn');
    const skipButton = document.getElementById('skip-btn');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const doneButton = document.getElementById('done-pedia-btn');
    const outputPedia = document.getElementById('output-pedia');
    const userNameSpan = document.getElementById('user-name-pedia');   
    const username = JSON.parse(localStorage.getItem('myself'))?.facebookName || "Magucal Friend"; 
    const userPic = document.getElementById('magic-user');

    userNameSpan.textContent = username;
    userPic.src = JSON.parse(localStorage.getItem('myself'))?.image|| "magic5.png";

    // Initialize with the first question
    displayQuestion();

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        
        // Apply typewriter effect to the question text
        typeWriterEffect(currentQuestion.question, questionDisplay);

        // Clear previous input field
        answerInputContainer.innerHTML = '';

        let inputElement;
        if (currentQuestion.type === 'select') {
            inputElement = document.createElement('select');
            currentQuestion.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                inputElement.appendChild(optionElement);
            });
        }   else if (currentQuestion.type === 'checkbox') {
            inputElement = document.createElement('div');
            inputElement.classList.add('checkbox-container');
            currentQuestion.options.forEach(option => {
                const checkboxLabel = document.createElement('label');
                checkboxLabel.classList.add('checkbox-label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option.name;
                checkbox.addEventListener('change', () => {
                    handleCheckboxChange(checkbox);
                });

                const image = document.createElement('img');
                image.src = option.image;
                image.alt = option.name;
                image.classList.add('friend-image');

                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(image);
                checkboxLabel.appendChild(document.createTextNode(option.name));
                inputElement.appendChild(checkboxLabel);
                inputElement.appendChild(document.createElement('br'));
            });
        } else if (currentQuestion.type === 'color') {
                    inputElement = document.createElement('input');
                    inputElement.type = 'color';
            } else {
            inputElement = document.createElement('input');
            inputElement.type = currentQuestion.type;
        }

        inputElement.id = 'answer';
        inputElement.placeholder = currentQuestion.placeholder || 'Type your answer here...'; // Set placeholder dynamically
        inputElement.value = answers[currentQuestion.question] || '';
        inputElement.addEventListener('input', () => {
            okButton.disabled = inputElement.value === '';
        });

        if (currentQuestion.type === 'select') {
            inputElement.addEventListener('change', () => {
                okButton.disabled = false;
            });
        }

        answerInputContainer.appendChild(inputElement);

        updateButtonStates();
    }

    function handleCheckboxChange(checkbox) {
        if (checkbox.checked) {
            if (selectedFriends.length < 3) {
                selectedFriends.push(checkbox.value);
            } else {
                checkbox.checked = false;
            }
        } else {
            const index = selectedFriends.indexOf(checkbox.value);
            if (index > -1) {
                selectedFriends.splice(index, 1);
            }
        }

        // Disable checkboxes when three friends are selected
        document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(cb => {
            if (!selectedFriends.includes(cb.value)) {
                cb.disabled = selectedFriends.length >= 3 && !cb.checked;
            }
        });

        // Enable the OK button only when exactly three friends are selected
        okButton.disabled = selectedFriends.length !== 3;
    }
    

    // Function to initialize the magic-pedia section and bind functionality
    function initializeMagicPedia() {
        const magicPediaDiv = document.querySelector('.magic-pedia');
        const saveAndPostButton = document.createElement('button');
        saveAndPostButton.textContent = 'Save and Post';
        saveAndPostButton.addEventListener('click', function() {

            magicPediaDiv.style.display = 'flex'; // Show magic-pedia section
        });

        const outputPediaDiv = document.getElementById('output-pedia');
        outputPediaDiv.appendChild(saveAndPostButton); // Append button inside output-pedia div
    }


    function updateButtonStates() {
        prevButton.disabled = currentQuestionIndex === 0;
        skipButton.disabled = currentQuestionIndex === questions.length - 1;
        nextButton.disabled = currentQuestionIndex === questions.length - 1;
        doneButton.style.display = currentQuestionIndex === questions.length - 1 ? 'inline-block' : 'none';
        okButton.disabled = true;
    }

    function nextQuestion() {
        saveAnswer();
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    }

    function saveAnswer() {
        const currentQuestion = questions[currentQuestionIndex];
        const answer = document.getElementById('answer').value;
        answers[currentQuestion.question] = answer;
    }

    function makeEditable(answerSpan) {
        const previousSiblingText = answerSpan.previousSibling.textContent.trim();
        const answerKey = previousSiblingText.slice(0, -1); // Remove the trailing colon
    
        let inputElement;
    
        // Determine the type of input based on the question type
        const currentQuestion = questions.find(q => q.question === answerKey);
        if (currentQuestion) {
            if (currentQuestion.type === 'number') {
                inputElement = document.createElement('input');
                inputElement.type = 'number';
                inputElement.placeholder = currentQuestion.placeholder;
            } else if (currentQuestion.type === 'select') {
                inputElement = document.createElement('select');
                currentQuestion.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    if (option === answerSpan.textContent) {
                        optionElement.selected = true;
                    }
                    inputElement.appendChild(optionElement);
                });
            } else if (currentQuestion.type === 'date') {
                inputElement = document.createElement('input');
                inputElement.type = 'date';
            } else {
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.placeholder = currentQuestion.placeholder;
            }
        } else {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
        }
    
        inputElement.value = answerSpan.textContent;
    
        inputElement.addEventListener('blur', () => saveEditedAnswer(inputElement, answerSpan));
        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveEditedAnswer(inputElement, answerSpan);
            }
        });
    
        answerSpan.replaceWith(inputElement);
        inputElement.focus();

    }
    
    function saveEditedAnswer(inputElement, answerSpan) {
        const newAnswer = inputElement.value;
        const previousSiblingText = inputElement.previousSibling ? inputElement.previousSibling.textContent.trim() : '';
    
        const answerKey = previousSiblingText.slice(0, -1); // Remove the trailing colon
    
        answers[answerKey] = newAnswer;
        inputElement.replaceWith(answerSpan);
        answerSpan.textContent = newAnswer;

        updateBottomSection();

        
    }
    
    // Function to update the displayed answers in the bottom section when an answer is edited
    function updateBottomSection() {
        document.querySelectorAll('.emphasized-word').forEach(answerSpan => {
            const previousSiblingText = answerSpan.previousSibling.textContent.trim();
            const answerKey = previousSiblingText.slice(0, -1); // Remove the trailing colon
    
            if (answers[answerKey]) {
                answerSpan.textContent = answers[answerKey];
            }

        });
    }


    function displayResults() {
        const genderPronouns = {
            "Male": { subject: "he", object: "him", possessive: "his" },
            "Female": { subject: "she", object: "her", possessive: "her" },
            "Other": { subject: "he/she", object: "him/her", possessive: "his/her" }
        };
    
        const userGender = answers["What is your gender?"];
        const pronouns = genderPronouns[userGender] || genderPronouns["Other"];
        
        let birthDate = answers["What is your birth date?"];
        let birthYear = '';
        let birthDay = '';
    
        // Validate birth date
        if (typeof birthDate === 'string') {
            birthDate = new Date(birthDate);
            birthYear = birthDate.getFullYear();
            if (isNaN(birthDate.getTime()) || birthYear < 1900 || birthYear > (new Date().getFullYear() - 5)) {
                // Invalid birth date handling
                alert('Invalid birth date:', birthDate);
                return; // Exit function if birth date is invalid
            }
            birthDay = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
        } else if (birthDate instanceof Date) {
            birthYear = birthDate.getFullYear();
            if (birthYear < 1900 || birthYear > (new Date().getFullYear() - 5)) {
                // Invalid birth date handling
                alert('Invalid birth date:', birthDate);
                return; // Exit function if birth date is invalid
            }
            birthDay = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
            // Invalid birth date handling
            alert('Invalid birth date:', birthDate);
            return; // Exit function if birth date is invalid
        }
    
        const bestFriend = answers["Who is your best friend?"] || "Magical Friend";
        

        const pediaContent = `
            ${username} (born ${answers["What is your country of birth?"]}, ${birthDate instanceof Date ? birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : birthDate}) is better known as ${answers["Do you have any other names or aliases?"]}. Currently marital status: ${answers["What is your marital status"]}.

            ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is ${answers["What is your profession?"]}. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is ${new Date().getFullYear() - birthYear} years old. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite color is ${answers["What is your favorite color?"]}, and ${pronouns.subject} loves reading ${answers["What is your favorite book?"]}. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} profession is ${answers["What is your profession?"]}, and ${pronouns.subject} has ${answers["Raised in a family of (siblings)?"]} siblings. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} enjoys ${answers["What is your hobby or favorite activity?"]} in ${pronouns.possessive} free time and ${pronouns.subject} is interested in ${answers["What are your interests in your career?"]}.
            ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} belief or principle is ${answers["What is your belief or principle based on?"]}. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is inspired by ${answers["What is your source of inspiration?"]} and aims to ${answers["What is your contribution or goal?"]}. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is known for ${pronouns.possessive} significant achievement: ${answers["What is your significant achievement?"]}. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} best friend is ${bestFriend}. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} also values top 3 friends: ${selectedFriends.join(', ')}.
            ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite movie is ${answers["What is your favorite movie?"]}. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite food is ${answers["What is your favorite food?"]}. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} dream vacation destination is ${answers["What is your dream vacation destination?"]}. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite sport is ${answers["What is your favorite sport?"]}.
        `;

    
        typeWriterEffectWithCallback(pediaContent, outputPedia,initializeMagicPedia);

        const bottomSection = document.getElementById('bottom-pedia-post');
        const birthMonth = birthDate instanceof Date ? birthDate.toLocaleDateString('en-US', { month: 'long' }) : birthDate;
        bottomSection.innerHTML = `
            <p>${username}(born <span  data-value="${answers["What is your country of birth?"]}" class="emphasized-word" data-value="${answers["What is your country of birth?"]}">${answers["What is your country of birth?"]}</span>, <span  data-value="${birthMonth}" class="emphasized-word">${birthDate instanceof Date ? birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : birthDate}</span>) is better known as <span >${answers["Do you have any other names or aliases?"]}</span>. Currently marital status: <span >${answers["What is your marital status"]}</span>.</p>
            <p>${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is a <span  data-value="${answers["What is your profession?"]}" class="emphasized-word" data-value="${answers["What is your profession?"]}">${answers["What is your profession?"]}</span>. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is <span >${new Date().getFullYear() - birthYear}</span> years old. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite color is <span  data-value="${answers["What is your favorite color?"]}" class="emphasized-word">${answers["What is your favorite color?"]}</span>, and ${pronouns.subject} loves reading <span  data-value="${answers["What is your favorite book?"]}" class="emphasized-word">${answers["What is your favorite book?"]}</span>. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} profession is <span  data-value="${answers["What is your profession?"]}" class="emphasized-word">${answers["What is your profession?"]}</span>, and ${pronouns.subject} raised with <span >${answers["Raised in a family of (siblings)?"]}</span> siblings. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} enjoys <span  data-value="${answers["What is your hobby or favorite activity?"]}" class="emphasized-word">${answers["What is your hobby or favorite activity?"]}</span> in ${pronouns.possessive} free time and ${pronouns.subject} is interested in <span >${answers["What are your interests in your career?"]}</span>.</p>
            <p>${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} belief or principle is <span  class="emphasized-word" data-value="${answers["What is your belief or principle based on?"]}">${answers["What is your belief or principle based on?"]}</span>. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is inspired by <span >${answers["What is your source of inspiration?"]}</span> and aims to <span >${answers["What is your contribution or goal?"]}</span>. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} is known for ${pronouns.possessive} significant achievement: <span >${answers["What is your significant achievement?"]}</span>. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} best friend is <span  data-value="${bestFriend}" class="emphasized-word">${bestFriend}</span>. ${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} also values top 3 friends: <span style="color: maroon;" class="emphasized-word">${selectedFriends.map(friend => `<span data-value="${friend}" class="emphasized-word">${friend}</span>`).join(', ')}</span>.</p>
            <p>${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite movie is <span  data-value="${answers["What is your favorite movie?"]}" class="emphasized-word">${answers["What is your favorite movie?"]}</span>. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite food is <span  data-value="${answers["What is your favorite food?"]}" class="emphasized-word">${answers["What is your favorite food?"]}</span>. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} dream vacation destination is <span  data-value="${answers["What is your dream vacation destination?"]}" class="emphasized-word">${answers["What is your dream vacation destination?"]}</span>. ${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} favorite sport is <span  data-value="${answers["What is your favorite sport?"]}" class="emphasized-word">${answers["What is your favorite sport?"]}</span>.</p>
        `;

    
        // Clear all inputs after displaying the result
        answers = {};
        currentQuestionIndex = 0;
        displayQuestion();
      
        document.querySelectorAll('.emphasized-word').forEach(word => {
            word.addEventListener('mouseenter', showSearchResults);
            word.addEventListener('mouseleave', hideSearchResults);
        });

       
        // Call makeEditable function for each editable span or section
        bottomSection.querySelectorAll('.emphasized-word').forEach(word => {
            word.addEventListener('dblclick', () => {
                makeEditable(word);
                });
            });
       
    }
    


    function typeWriterEffect(text, element) {
        element.innerHTML = ''; // Clear previous content
        const typewriterContainer = document.createElement('div');
        typewriterContainer.classList.add('typewriter');
        element.appendChild(typewriterContainer);

        let index = 0;

        function type() {
            if (index < text.length) {
                typewriterContainer.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50); // Adjust typing speed here
            }
        }

        type();
    }

    // Standalone function for typing effect with callback
    function typeWriterEffectWithCallback(text, element, callback) {
        element.innerHTML = ''; // Clear previous content
        const typewriterContainer = document.createElement('div');
        typewriterContainer.classList.add('typewriter');
        element.appendChild(typewriterContainer);

        let index = 0;

        function type() {
            if (index < text.length) {
                typewriterContainer.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50); // Adjust typing speed here
            } else {
                if (callback && typeof callback === 'function') {
                    callback(); // Call callback function after typing finishes
                }
            }
        }

        type();
    }
    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', function() {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    displayQuestion();
                    const inputElement = document.getElementById('answer');
                    inputElement.select(); // Select the input value for review
                }
            });


    skipButton.addEventListener('click', function() {
            if (currentQuestionIndex < questions.length - 1) {
                    currentQuestionIndex++;
                    displayQuestion();
            }
    });
        
    okButton.addEventListener('click', function() {
        saveAnswer();
        nextQuestion();
    });

    doneButton.addEventListener('click', function() {
        saveAnswer();
        displayResults();
    });

    // Handle pressing Enter to move to the next question
    document.getElementById('answer-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !okButton.disabled) {
            event.preventDefault();
            saveAnswer();
            nextQuestion();
        }
    });


    function showSearchResults(event) {
        const word = event.target;
        const searchDiv = document.getElementById('search-div');
        searchDiv.style.display = 'block';
        searchDiv.style.left = `${event.pageX}px`;
        searchDiv.style.top = `${event.pageY + 20}px`;
        searchDiv.innerHTML = `Searching for: ${word.getAttribute('data-value')}`;
    
        // Perform search (placeholder for search functionality)
        performSearch(word.getAttribute('data-value'), (results) => {
            searchDiv.innerHTML = `Looking for: ${word.getAttribute('data-value')}<br>${results}`;
        });
    }
    
    function hideSearchResults() {
        const searchDiv = document.getElementById('search-div');
        searchDiv.style.display = 'none';
    }

    function performSearch(query, callback) {
        // Check if query matches a friend's name in localStorage
        const friendImages = JSON.parse(localStorage.getItem('friends'));
        const matchingImage = friendImages.find(friend => friend.name.toLowerCase() === query.toLowerCase());
    
        if (matchingImage) {
            // Display friend's image instead of performing Wikipedia search
            const imageHtml = `<img src="${matchingImage.image}" style="max-width: 200px; max-height: 100px;"><br> <p> ${matchingImage.description}</p>`;
            callback(imageHtml);
        } else {
            // Perform Wikipedia search
            const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.query && data.query.search && data.query.search.length > 0) {
                        const results = data.query.search.map(result => `<div><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}" target="_blank">${result.title}</a><p>${result.snippet}</p></div>`).join('<br>');
                        callback(`found: ${query}<br>${results}`);
                    } else {
                        const noResultHtml = `
                            <p> No results found for: ${query}(double click to edit)</p> <br> <img src="magic5.png" alt="default-image">`;
                        callback(noResultHtml);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data from Wikipedia:', error);
                    const nodataHtml = `
                            <p> No data found for: ${query}(check your connection)</p> <br> <img src="magic5.png" alt="default-image">`;
                        callback(nodataHtml);
                });
        }
    }
    
});



//====================================================================================================================================


//===================================================================================================================================function loadUserData(){const e=JSON.parse(localStorage.getItem("myself"));e?(document.getElementById("username").textContent=e.facebookName,document.getElementById("userImages").src=e.image,document.getElementById("userBio").textContent=`Bio: ${e.bio}`):window.location.href="index.html"}document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("menu-toggle"),t=document.getElementById("nav"),n=document.querySelectorAll("#nav a"),o=document.querySelectorAll("section"),i=localStorage.getItem("activeSectionId"),a=n=>{n?(t.style.left="0",e.setAttribute("aria-expanded","true")):(t.style.left="-100%",e.setAttribute("aria-expanded","false"))};if(e.addEventListener("click",(function(){const t="true"===e.getAttribute("aria-expanded");a(!t)})),n.forEach((e=>{e.addEventListener("click",(function(t){t.preventDefault(),n.forEach((e=>e.classList.remove("active"))),e.classList.add("active");const i=e.getAttribute("href").substring(1),s=document.getElementById(i);o.forEach((e=>e.style.display="none")),s&&(s.style.display="flex",localStorage.setItem("activeSectionId",i),a(!1))}))})),i){const e=document.getElementById(i);e&&(o.forEach((e=>e.style.display="none")),e.style.display="flex",n.forEach((e=>{e.classList.remove("active"),e.getAttribute("href").substring(1)===i&&e.classList.add("active")})))}else{o.forEach((e=>e.style.display="none"));const e=document.querySelector("#home");e&&(e.style.display="flex",n.forEach((e=>{"home"===e.getAttribute("href").substring(1)&&e.classList.add("active")})))}})),window.addEventListener("beforeunload",(()=>{const e=document.querySelector("#nav a.active");if(e){const t=e.getAttribute("href").substring(1);localStorage.setItem("activeSectionId",t)}})),document.addEventListener("DOMContentLoaded",loadUserData),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("friendsContainer"),t=document.getElementById("viewOverlay"),n=document.getElementById("viewOptions"),o=document.getElementById("largeImage"),i=document.querySelector(".closeOverlay button"),a=document.getElementById("downloadButton");t.style.display="none",function(){const s=JSON.parse(localStorage.getItem("friends"));if(s&&s.length){if(s.length<5)return void(window.location.href="index.html");s.forEach(((s,r)=>{const c=function(e,t){const n=document.createElement("div");n.classList.add("friend");const o=document.createElement("div");o.classList.add("friend-front");const i=document.createElement("img");i.src=e.image,i.alt=`${e.name}'s image`,o.appendChild(i);const a=document.createElement("div");a.classList.add("friend-back");const s=document.createElement("p");return s.textContent=`Name: ${e.name}`,a.appendChild(s),n.appendChild(o),n.appendChild(a),n}(s);e.appendChild(c),c.addEventListener("click",(()=>{!function(e){n.innerHTML="",t.style.display="flex";["polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)","polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)","polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)","polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)","polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)","polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)","polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)","polygon(25% 0%, 75% 0%, 100% 25%, 75% 50%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 25% 50%, 0% 25%)","polygon(50% 0%, 61% 35%, 100% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 0% 35%, 39% 35%)","polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)","polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)","polygon(0% 0%, 100% 0%, 100% 60%, 60% 100%, 40% 100%, 0% 60%)","polygon(50% 0%, 90% 15%, 100% 50%, 90% 85%, 50% 100%, 10% 85%, 0% 50%, 10% 15%)","polygon(50% 0%, 90% 10%, 100% 35%, 90% 70%, 50% 90%, 20% 70%, 0% 35%, 10% 10%)","polygon(0% 15%, 35% 0%, 65% 0%, 100% 15%, 100% 85%, 65% 100%, 35% 100%, 0% 85%)","polygon(50% 0%, 63% 25%, 95% 25%, 75% 45%, 85% 75%, 50% 55%, 15% 75%, 25% 45%, 5% 25%, 37% 25%)","polygon(50% 0%, 80% 10%, 95% 40%, 80% 70%, 50% 90%, 20% 70%, 5% 40%, 20% 10%)","polygon(50% 0%, 70% 15%, 95% 50%, 70% 85%, 50% 100%, 30% 85%, 5% 50%, 30% 15%)","polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)","polygon(50% 20%, 90% 50%, 100% 80%, 50% 100%, 0% 80%)","polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)","polygon(0% 0%, 100% 0%, 100% 60%, 60% 100%, 40% 100%, 0% 60%)","polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)","polygon(20% 0%, 80% 0%, 100% 20%, 100% 20%, 52% 100%, 46% 100%, 0 20%, 0% 20%)","polygon(50% 20%, 90% 0, 100% 40%, 70% 100%, 50% 100%, 30% 100%, 0 40%, 10% 0)","polygon(52% 33%, 72% 17%, 87% 27%, 86% 44%, 65% 75%, 50% 100%, 34% 74%, 19% 46%, 19% 26%, 36% 15%)","polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)","polygon(3.769% 22.712%, 83.418% 63.141%, 78.396% 63.141%, 81.475% 65.574%, 81.475% 65.574%, 83.224% 67.202%, 84.584% 68.981%, 85.556% 70.873%, 86.139% 72.841%, 86.333% 74.847%, 86.139% 76.852%, 85.556% 78.819%, 84.584% 80.709%, 83.224% 82.486%, 81.475% 84.11%, 81.475% 84.11%, 80.475% 84.839%, 79.42% 85.492%, 78.318% 86.069%, 77.174% 86.568%, 75.993% 86.992%, 74.782% 87.338%, 73.547% 87.607%, 72.293% 87.8%, 71.026% 87.916%, 69.752% 87.954%, 69.752% 87.954%, 68.479% 87.916%, 67.211% 87.8%, 65.955% 87.607%, 64.717% 87.338%, 63.504% 86.992%, 62.321% 86.568%, 61.174% 86.069%, 60.07% 85.492%, 59.015% 84.839%, 58.014% 84.11%, 53.339% 80.416%, 53.339% 86.895%, 53.339% 86.895%, 53.122% 89.021%, 52.493% 91.038%, 51.488% 92.919%, 50.139% 94.636%, 48.481% 96.163%, 46.549% 97.472%, 44.375% 98.538%, 41.996% 99.332%, 39.443% 99.829%, 36.753% 100%, 36.753% 100%, 34.062% 99.829%, 31.51% 99.332%, 29.13% 98.537%, 26.957% 97.472%, 25.024% 96.162%, 23.366% 94.635%, 22.018% 92.918%, 21.012% 91.038%, 20.383% 89.021%, 20.166% 86.895%, 20.166% 80.428%, 15.507% 84.11%, 15.507% 84.11%, 14.506% 84.839%, 13.451% 85.492%, 12.347% 86.069%, 11.2% 86.568%, 10.017% 86.992%, 8.804% 87.338%, 7.566% 87.607%, 6.311% 87.8%, 5.043% 87.916%, 3.769% 87.954%, 3.769% 87.954%, 2.495% 87.916%, 1.229% 87.8%, -0.025% 87.607%, -1.261% 87.338%, -2.472% 86.992%, -3.652% 86.568%, -4.797% 86.069%, -5.899% 85.492%, -6.953% 84.839%, -7.954% 84.11%, -7.954% 84.11%, -9.703% 82.486%, -11.063% 80.709%, -12.034% 78.819%, -12.617% 76.852%, -12.812% 74.847%, -12.617% 72.841%, -12.034% 70.873%, -11.063% 68.981%, -9.703% 67.202%, -7.954% 65.574%, -4.874% 63.141%, -9.897% 63.141%, -9.897% 63.141%, -12.588% 62.969%, -15.141% 62.472%, -17.521% 61.676%, -19.694% 60.609%, -21.626% 59.298%, -23.284% 57.77%, -24.633% 56.053%, -25.638% 54.173%, -26.266% 52.159%, -26.483% 50.036%, -26.483% 50.036%, -26.266% 47.913%, -25.638% 45.898%, -24.632% 44.018%, -23.283% 42.301%, -21.626% 40.773%, -19.693% 39.462%, -17.52% 38.395%, -15.14% 37.6%, -12.588% 37.102%, -9.897% 36.93%, -1.697% 36.93%, -7.954% 31.987%, -7.954% 31.987%, -9.703% 30.362%, -11.063% 28.585%, -12.034% 26.693%, -12.617% 24.725%, -12.812% 22.719%, -12.617% 20.713%, -12.034% 18.745%, -11.063% 16.853%, -9.703% 15.076%, -7.954% 13.451%, -7.954% 13.451%, -5.898% 12.069%, -3.649% 10.995%, -1.254% 10.227%, 1.236% 9.766%, 3.776% 9.613%, 6.315% 9.766%, 8.806% 10.227%, 11.2% 10.995%, 13.449% 12.069%, 15.505% 13.451%, 20.164% 17.134%, 20.164% 13.166%, 20.164% 13.166%, 20.382% 11.039%, 21.011% 9.022%, 22.018% 7.142%, 23.369% 5.425%, 25.028% 3.898%, 26.961% 2.588%, 29.135% 1.523%, 31.514% 0.728%, 34.064% 0.232%, 36.75% 0.061%, 36.75% 0.061%, 39.437% 0.232%, 41.987% 0.729%, 44.366% 1.523%, 46.54% 2.589%, 48.473% 3.899%, 50.132% 5.426%, 51.483% 7.143%, 52.49% 9.023%, 53.119% 11.04%, 53.337% 13.166%, 53.337% 17.147%, 58.012% 13.453%, 58.012% 13.453%, 60.068% 12.071%, 62.317% 10.997%, 64.711% 10.229%, 67.202% 9.768%, 69.741% 9.615%, 72.28% 9.768%, 74.771% 10.229%, 77.165% 10.997%, 79.415% 12.071%, 81.471% 13.453%, 81.471% 13.453%, 83.219% 15.078%, 84.58% 16.855%, 85.551% 18.746%, 86.134% 20.715%, 86.328% 22.721%, 86.134% 24.727%, 85.551% 26.695%, 84.58% 28.587%, 83.219% 30.364%, 81.471% 31.989%, 75.214% 36.932%, 83.414% 36.932%, 83.414% 36.932%, 86.105% 37.104%, 88.657% 37.6%, 91.037% 38.395%, 93.211% 39.461%, 95.143% 40.77%, 96.801% 42.297%, 98.149% 44.015%, 99.155% 45.895%, 99.783% 47.912%, 100% 50.037%, 100% 50.037%, 99.783% 52.163%, 99.155% 54.18%, 98.149% 56.06%, 96.8% 57.778%, 95.142% 59.305%, 93.21% 60.614%, 91.037% 61.68%, 88.657% 62.475%, 86.104% 62.971%, 83.414% 63.143%, 3.769% 22.712%)","polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)","polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)","polygon(0 0, 100% 0, 51% 100%, 51% 100%)","polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)","polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)","polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)","polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)","polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)","polygon(50% 0%, 0% 100%, 100% 100%)","polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)","polygon(11% 20%, 35% 11%, 35% 0%, 70% 1%, 70% 25%, 70% 49%, 70% 49%, 69% 100%, 35% 100%, 34% 36%, 11% 40%)","polygon(6% 6%, 92% 97%, -1% 94%, 96% 1%)","polygon(75% 0%, 75% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)","polygon(75% 0%, 45% 50%, 75% 100%, 0% 100%, -2% 50%, 0% 0%)","polygon(100% -5%, -1% -2%, 1% 95%, 101% 96%, 43% 43%)","polygon(100% -5%, -1% -2%, 48% 42%, 0% 93%, 100% 92%)","polygon(68% 23%, 1% -1%, 8% 28%, 14% 63%, 98% 95%)","polygon(95% 0%, 22% 15%, 0% 95%, 0% 96%, 75% 61%)","polygon(50% 0%, 61% 16%, 80% 16%, 91% 29%, 100% 50%, 91% 71%, 80% 84%, 50% 100%, 20% 84%, 9% 71%, 0% 50%, 9% 29%, 20% 16%,39% 16%)","polygon( 50% 0%, 60% 10%, 70% 15%, 80% 25%, 85% 40%, 80% 55%, 70% 70%, 60% 80%, 50% 90%, 40% 80%, 30% 70%, 20% 55%, 15% 40%, 20% 25%, 30% 15%, 40% 10%","polygon(51% 24%, 60% 9%, 70% 4%, 85% 5%, 92% 12%, 93% 25%, 88% 40%, 83% 52%, 76% 62%, 66% 76%, 58% 86%, 49% 95%, 39% 83%, 30% 71%, 22% 59%, 15% 47%, 10% 36%, 9% 26%, 9% 16%, 16% 7%, 27% 5%, 36% 5%, 45% 10%)","polygon(94% 4%, 44% 32%, 4% 18%, 12% 71%, 83% 67%)","polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)","polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)","polygon(50% 0%, 100% 1%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 0 0)","polygon(15% 16%, 35% 10%, 35% 0%, 65% 0%, 65% 25%, 65% 25%, 65% 50%, 65% 50%, 65% 85%, 35% 85%, 34% 34%, 15% 38%)","polygon(0% 0%,  100% 0%, 100% 20%, 20% 20%, 80% 80%, 0% 80%, 0% 100%, 100% 100%, 100% 80%, 20% 80%, 80% 20%, 0% 20%)","polygon(0% 15%, 1% 0, 15% 0%, 85% 0%, 100% 0, 100% 15%, 100% 85%, 73% 85%, 83% 100%, 15% 100%, 30% 85%, 0% 85%)","polygon(0 0, 100% 0, 100% 20%, 100% 80%, 100% 100%, 20% 100%, 0% 80%, 0% 20%)","polygon(0 0, 100% 0, 100% 41%, 100% 80%, 76% 100%, 0 100%, 0 80%, 0 43%)","polygon(0 0, 100% 0, 100% 41%, 100% 80%, 76% 100%, 0 100%, 0 80%, 0 43%)","polygon(0 0, 0 100%, 100% 1%, 100% 100%, 46% 56%)","polygon(35% 0, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 64% 0, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)","polygon(0 51%, 0 25%, 0 0, 100% 0, 100% 26%, 100% 50%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 7% 50%)","polygon(0 51%, 0 25%, 0 0, 100% 0, 100% 26%, 100% 50%, 100% 50%, 100% 100%, 50% 67%, 50% 67%, 0 100%, 0 49%)","polygon(1% 0, 35% 0, 35% 0%, 65% 0%, 65% 0, 100% 0, 100% 33%, 65% 33%, 65% 100%, 35% 100%, 36% 34%, 0 34%)","polygon(100% 1%, 52% 50%, 52% 0, 0 50%, 53% 100%, 52% 50%, 100% 100%)","polygon(0 0, 100% 45%, 100% 45%, 42% 100%, 100% 45%, 0 99%, 0 45%)","polygon(100% 0, 42% 52%, 0 55%, 100% 0, 100% 100%, 0 55%)","polygon(0 21%, 58% 51%, 60% 0%, 100% 50%, 60% 100%, 58% 51%, 0% 80%)","polygon(40% 0%, 42% 51%, 100% 0, 100% 100%, 42% 51%, 40% 100%, 0% 50%)","polygon(0 0, 61% 47%, 60% 0%, 100% 50%, 60% 100%, 61% 47%, 0 100%)","polygon(0 0, 61% 47%, 60% 0%, 100% 50%, 60% 100%, 61% 47%, 0 100%)","polygon(49% 0, 50% 50%, 100% 0, 100% 100%, 50% 50%, 48% 100%, 0% 50%)","polygon(100% 0%, 0 49%, 100% 50%, 0 100%, 0 49%, 100% 50%)","polygon(45% 21%, 40% 10%, 32% 6%, 17% 4%, 6% 7%, 0% 15%, 1% 27%, 6% 42%, 10% 51%, 16% 61%, 22% 71%, 30% 81%, 43% 95%, 55% 84%, 67% 71%, 75% 59%, 81% 50%, 88% 39%, 93% 27%, 93% 16%, 86% 6%, 70% 5%, 58% 7%, 50% 15%, 46% 28%)"].forEach(((t,i)=>{const a=document.createElement("div");a.classList.add("clip-path-option"),a.style.clipPath=t;const s=document.createElement("img");s.src=e.image,s.alt=`View ${i+1}`,s.style.clipPath=t,s.addEventListener("click",(()=>{var n,i;n=e.image,i=t,o.src=n,o.style.clipPath=i})),a.appendChild(s),n.appendChild(a)})),a.addEventListener("click",(()=>{!function(e,t,n){const o=document.createElement("canvas"),i=o.getContext("2d"),a=new Image;a.crossOrigin="anonymous",a.onload=function(){if(o.width=a.width,o.height=a.height,i.clearRect(0,0,o.width,o.height),t){const e=function(e,t,n){const o=new Path2D;if(e.startsWith("polygon")){const i=e.match(/\d+(\.\d+)?%/g).map((e=>parseFloat(e)/100));for(let e=0;e<i.length;e+=2){const a=i[e]*t,s=i[e+1]*n;0===e?o.moveTo(a,s):o.lineTo(a,s)}o.closePath()}else if(e.startsWith("circle")){const i=e.match(/circle\((\d+(\.\d+)?%) at (\d+(\.\d+)?%) (\d+(\.\d+)?%)\)/),a=parseFloat(i[1])/100*Math.min(t,n)/2,s=parseFloat(i[3])/100*t,r=parseFloat(i[5])/100*n;o.arc(s,r,a,0,2*Math.PI)}else if(e.startsWith("ellipse")){const i=e.match(/ellipse\((\d+(\.\d+)?%) (\d+(\.\d+)?%) at (\d+(\.\d+)?%) (\d+(\.\d+)?%)\)/),a=parseFloat(i[1])/100*t/2,s=parseFloat(i[2])/100*n/2,r=parseFloat(i[4])/100*t,c=parseFloat(i[6])/100*n;o.ellipse(r,c,a,s,0,0,2*Math.PI)}return o}(t,o.width,o.height);i.save(),i.beginPath(),i.clip(e),i.drawImage(a,0,0,o.width,o.height),i.restore()}else i.drawImage(a,0,0,o.width,o.height);o.toBlob((function(e){const t=document.createElement("a"),o=URL.createObjectURL(e);t.href=o,t.download=`Magical-Friend-${n.name}.png`,document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(o)}),"image/png")},a.src=e}(o.src,o.style.clipPath,e)})),i.addEventListener("click",(()=>{t.style.display="none",o.src="logo.png"}))}(s)}))}))}else window.location.href="index.html"}()})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("viewOverlay");function t(){e.style.display="none"===e.style.display||""===e.style.display?"flex":"none"}document.querySelector(".closeOverlay button").addEventListener("click",t),e.addEventListener("click",(n=>{n.target===e&&t()}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("friendsContainer"),t=Array.from(e.children);function n(){t.forEach((e=>{const t=e.getBoundingClientRect();t.top<window.innerHeight&&t.bottom>0?e.classList.add("animate","visible"):e.classList.remove("animate","visible")}))}n(),window.addEventListener("scroll",n)})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("userCanvas"),t=e.getContext("2d");e.width=e.clientWidth,e.height=e.clientHeight;const n=[],o=["#ff00ff","#ff99ff","#cc00cc","#ff66ff","#ff33ff"];class i{constructor(e,t){this.x=e,this.y=t,this.size=2*Math.random()+1,this.speedX=3*Math.random()-1.5,this.speedY=3*Math.random()-1.5,this.color=o[Math.floor(Math.random()*o.length)]}update(){this.x+=this.speedX,this.y+=this.speedY,this.size>.1&&(this.size-=.01)}draw(){t.fillStyle=this.color,t.beginPath(),t.arc(this.x,this.y,this.size,0,2*Math.PI),t.closePath(),t.fill()}}setInterval((function(){const t=e.getBoundingClientRect(),o=Math.random()*t.width,a=Math.random()*t.height;for(let e=0;e<5;e++)n.push(new i(o,a))}),100),function o(){t.clearRect(0,0,e.width,e.height),function(){for(let e=0;e<n.length;e++)n[e].update(),n[e].draw(),n[e].size<=.1&&(n.splice(e,1),e--)}(),requestAnimationFrame(o)}()})),document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("magiic-2"),t=new THREE.Scene,n=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),o=new THREE.WebGLRenderer({canvas:e});o.setSize(window.innerWidth,window.innerHeight),n.position.z=10;const i=new THREE.TextureLoader,a=i.load("magic5.png"),s=i.load("logo.png"),r=i.load("heart.png"),c=[],l=[];function d(e,n){const o=new THREE.BoxGeometry(10,10,10),i=new THREE.MeshBasicMaterial({map:e}),a=new THREE.Mesh(o,i);return a.position.set(80*Math.random()-40,80*Math.random()-40,80*Math.random()-40),t.add(a),n?c.push(a):l.push(a),a}for(let e=0;e<20;e++)d(a,!0);for(let e=0;e<20;e++){const e=d(s,!1),t=c[Math.floor(Math.random()*c.length)];e.userData.targetCube=t}!function e(){l.forEach((e=>{const n=e.userData.targetCube;if(n){const o=new THREE.Vector3;o.subVectors(n.position,e.position).normalize(),e.position.add(o.multiplyScalar(.5));e.position.distanceTo(n.position)<5&&(!function(e){const n=new THREE.PlaneGeometry(6,6),o=new THREE.MeshBasicMaterial({map:r,transparent:!0}),i=new THREE.Mesh(n,o);i.position.copy(e),t.add(i),function e(){i.scale.x+=.1,i.scale.y+=.1,i.material.opacity-=.09,i.material.opacity<=0?(t.remove(i),setTimeout((()=>{c.forEach((e=>{e.material.color.setHex(16777215)})),l.forEach((e=>{e.material.color.setHex(16777215)}))}),2e3)):requestAnimationFrame(e)}()}(n.position),e.material.color.setHex(16711680),n.material.color.setHex(16711680),e.position.set(40*Math.random()-20,40*Math.random()-20,40*Math.random()-20),n.position.set(40*Math.random()-20,40*Math.random()-20,40*Math.random()-20))}})),setTimeout(e,500)}(),function e(){requestAnimationFrame(e),c.forEach((e=>{e.rotation.x+=.0095,e.rotation.y+=.0095})),l.forEach((e=>{e.rotation.x-=.0075,e.rotation.y-=.0075})),o.render(t,n)}(),window.addEventListener("resize",(()=>{o.setSize(window.innerWidth,window.innerHeight),n.aspect=window.innerWidth/window.innerHeight,n.updateProjectionMatrix()}))}));const canvasMagic=document.getElementById("magiic-1"),sceneMagic=new THREE.Scene,cameraMagic=new THREE.PerspectiveCamera(75,canvasMagic.clientWidth/canvasMagic.clientHeight,.1,1e3),rendererMagic=new THREE.WebGLRenderer({canvas:canvasMagic});rendererMagic.setSize(canvasMagic.clientWidth,canvasMagic.clientHeight);const textureLoader=new THREE.TextureLoader,logoTexture=textureLoader.load("logo.png"),logoTwoTexture=textureLoader.load("magic5.png"),userImageUrl=JSON.parse(localStorage.getItem("myself")),userTexture=textureLoader.load(userImageUrl.image);function loadFriendTextures(){const e=[];return(JSON.parse(localStorage.getItem("friends"))||[]).forEach((t=>{const n=textureLoader.load(t.image);e.push(n)})),e}const friendTextures=loadFriendTextures();function createCube(e){const t=new THREE.BoxGeometry(.8,.8,.8),n=new THREE.MeshBasicMaterial({map:e}),o=new THREE.Mesh(t,n);return o.position.set(10*Math.random()-5,10*Math.random(),10*Math.random()-5),sceneMagic.add(o),o}function loadMagicScene(){sceneMagic.children=[];const e=[logoTexture,logoTwoTexture,userTexture,...friendTextures];for(let t=0;t<200;t++){createCube(e[Math.floor(Math.random()*e.length)])}!function e(){requestAnimationFrame(e),sceneMagic.children.forEach((e=>{e.rotation.x+=.01,e.rotation.y+=.01,e.position.y-=.05,e.position.y<-5&&(e.position.y=10*Math.random()+5,e.position.x=10*Math.random()-5,e.position.z=10*Math.random()-5)})),rendererMagic.render(sceneMagic,cameraMagic)}()}loadMagicScene(),window.addEventListener("resize",(()=>{const e=canvasMagic.clientWidth,t=canvasMagic.clientHeight;rendererMagic.setSize(e,t),cameraMagic.aspect=e/t,cameraMagic.updateProjectionMatrix();const n=Math.min(e,t)/600;sceneMagic.children.forEach((e=>{e.scale.set(n,n,n)}))}));let scrollOffset=0,previousScrollOffset=0;window.addEventListener("scroll",(()=>{scrollOffset=window.scrollY;const e=scrollOffset>previousScrollOffset?"down":"up";sceneMagic.children.forEach((t=>{"down"===e?t.position.y-=.05:t.position.y+=.09,t.position.y<-5&&(t.position.y=10*Math.random()+5,t.position.x=10*Math.random()-5,t.position.z=10*Math.random()-5)})),previousScrollOffset=scrollOffset})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelectorAll(".song-card"),t=document.getElementById("getUserSong"),n=document.getElementById("overlay"),o=document.getElementById("logo"),i=document.getElementById("userImage");let a=null;const s=JSON.parse(localStorage.getItem("myself")).image;function r(){n.classList.add("show-overlay"),o.style.animation="swapPosition 4s ease-in-out 0s 3 alternate both;",i.style.animation="swapPosition 4s infinite"}function c(){n.classList.remove("show-overlay"),o.style.animation="none",i.style.animation="none"}s?i.src=s:window.location.href="index.html",e.forEach((e=>{const t=e.querySelector(".details .deeper-details button:first-child"),n=e.querySelector("audio"),o=e.querySelector(".duration"),i=e.querySelector(".visualizer"),s=e.querySelector(".logo");if(n.addEventListener("waiting",r),n.addEventListener("stalled",r),n.addEventListener("playing",c),n.addEventListener("pause",c),n.addEventListener("ended",c),n.addEventListener("loadedmetadata",c),!(t&&n&&o&&i))return void alert("One or more elements not found in song card:",e);const l=i.getContext("2d");let d,m,u,p,h=!1;t.addEventListener("click",(()=>{if(a&&a!==n){a.pause();const e=a.closest(".song-card");e.querySelector(".details .deeper-details button:first-child").innerHTML="&#9654;",e.classList.remove("playing");const t=e.querySelector(".logo");t&&(t.style.display="block"),e.querySelector(".visualizer").getContext("2d").clearRect(0,0,i.width,i.height),h=!1}n.paused?(n.play(),t.innerHTML="&#10073; &#10073;",a=n,e.classList.add("playing"),s.style.display="none",function(e,t){d=new(window.AudioContext||window.webkitAudioContext),m=d.createAnalyser();const n=d.createMediaElementSource(e);function o(){if(!a||a!==e)return;requestAnimationFrame(o),m.getByteFrequencyData(u),t.clearRect(0,0,i.width,i.height);const n=i.width/p*2.5;let s,r=0;for(let e=0;e<p;e++)s=u[e],t.fillStyle="rgb(0, 0, "+(s+100)+")",t.fillRect(r,i.height-s/2,n,s/2),r+=n+1}n.connect(m),m.connect(d.destination),m.fftSize=128,p=m.frequencyBinCount,u=new Uint8Array(p),o()}(n,l),h=!0):(n.pause(),t.innerHTML="&#9654;",a=null,e.classList.remove("playing"),s.style.display="block",i.getContext("2d").clearRect(0,0,i.width,i.height),h=!1)})),n.addEventListener("timeupdate",(()=>{o.innerHTML="&#9835; "+function(e){const t=Math.floor(e/60),n=Math.floor(e%60);return`${t}:${n<10?"0":""}${n}`}(n.currentTime)})),n.addEventListener("ended",(()=>{t.innerHTML="&#9654;",a=null,e.classList.remove("playing"),s.style.display="block",h=!1})),n.addEventListener("play",(()=>{e.classList.add("playing"),s.style.display="none",h=!0}))})),t.addEventListener("change",(e=>{const t=e.target.files[0];if(t){const e=URL.createObjectURL(t);!function(e,t){const n=document.getElementById("songs"),o=document.createElement("div");o.classList.add("song-card"),o.innerHTML=`\n            <div class="logo"></div>\n            <h3>${e}</h3>\n            <div class="song-audio">\n                <audio src="${t}"></audio>\n            </div>\n            <div class="duration">0:00</div>\n            <div class="details">\n                <div class="deeper-details">\n                    <div class="all-button-container">\n                        <button>&#9654;</button>\n                        <button>&#9655;</button>\n                        <button>Select</button>\n                    </div>\n                    <canvas class="visualizer"></canvas>\n                </div>\n            </div>\n        `,n.appendChild(o);const i=o.querySelector(".details .deeper-details button:first-child"),s=o.querySelector("audio"),r=o.querySelector(".duration"),c=o.querySelector(".visualizer"),l=o.querySelector(".logo");if(!(i&&s&&r&&c))return void alert("One or more elements not found in newly created song card:",o);const d=c.getContext("2d");let m,u,p,h;function y(e,t){m=new(window.AudioContext||window.webkitAudioContext),u=m.createAnalyser();m.createMediaElementSource(e).connect(u),u.connect(m.destination),u.fftSize=128,h=u.frequencyBinCount,p=new Uint8Array(h),g()}function g(){if(!a)return;requestAnimationFrame(g),u.getByteFrequencyData(p),d.clearRect(0,0,c.width,c.height);const e=c.width/h*2.5;let t,n=0;for(let o=0;o<h;o++)t=p[o],d.fillStyle="rgb(0, 0, "+(t+100)+")",d.fillRect(n,c.height-t/2,e,t/2),n+=e+1}function f(e){const t=Math.floor(e/60),n=Math.floor(e%60);return`${t}:${n<10?"0":""}${n}`}i.addEventListener("click",(()=>{if(a&&a!==s){a.pause();const e=a.closest(".song-card");e.querySelector(".details .deeper-details button:first-child").innerHTML="&#9654;",e.classList.remove("playing");const t=e.querySelector(".logo");t&&(t.style.display="block")}s.paused?(s.play(),i.innerHTML="&#10073; &#10073;",a=s,o.classList.add("playing"),l.style.display="none",y(s,d)):(s.pause(),i.innerHTML="&#9654;",a=null,o.classList.remove("playing"),l.style.display="block")})),s.addEventListener("timeupdate",(()=>{r.textContent=f(s.currentTime)})),s.addEventListener("ended",(()=>{i.innerHTML="&#9654;",a=null,o.classList.remove("playing"),l.style.display="block"}))}(t.name,e);document.querySelector(".song-card:last-child").scrollIntoView({behavior:"smooth"})}}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".friends-view"),t=document.querySelector(".selected-song"),n=JSON.parse(localStorage.getItem("friends")),o=()=>{t.children.length<=1?document.querySelectorAll(".friend-checkbox").forEach((e=>{e.disabled=!0,e.style.display="none"})):document.querySelectorAll(".friend-checkbox").forEach((e=>{e.disabled=!1,e.style.display="block"}))};n&&Array.isArray(n)?n.forEach((n=>{const i=document.createElement("div");i.classList.add("friend-card"),i.innerHTML=`\n            <img src="${n.image}" alt="${n.name}"><br><input type="checkbox" class="friend-checkbox">`;const a=i.querySelector(".friend-checkbox");i.addEventListener("click",(()=>{a.checked=!a.checked,console.log(`Clicked on friend: ${n.name}`)})),e.appendChild(i),o(),t.addEventListener("DOMSubtreeModified",o)})):console.error("Friends data not found in localStorage")})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".selected-song");let t=null;const n=document.querySelector("#slideshows h4"),o=document.querySelector(".loading-indicator"),i=()=>{o.style.display="block"},a=()=>{o.style.display="none"};a();const s=()=>{e.children.length<=1?(n.style.display="block",document.querySelectorAll("#slideshow-1 button").forEach((e=>e.disabled=!0))):(n.style.display="none",document.querySelectorAll("#slideshow-1 button").forEach((e=>e.disabled=!1)))};s(),e.addEventListener("DOMSubtreeModified",s),document.addEventListener("click",(n=>{const o=n.target.closest(".song-card button:nth-of-type(3)");if(!o)return;if(o.classList.contains("selected"))return;const r=o.closest(".song-card"),c=r.querySelector("audio");t&&(t.pause(),t.currentTime=0);const l=document.createElement("div");l.classList.add("song-carded");const d=document.createElement("h3");d.textContent=r.querySelector("h3").textContent;const m=document.createElement("audio");m.src=c.src,m.controls=!1,m.addEventListener("waiting",i),m.addEventListener("stalled",i),m.addEventListener("playing",a),m.addEventListener("pause",a),m.addEventListener("ended",a),m.addEventListener("loadedmetadata",a),m.addEventListener("canplay",a),m.addEventListener("canplaythrough",a);const u=document.createElement("div");u.classList.add("detail");const p=document.createElement("div");p.classList.add("deeper-details");const h=document.createElement("button");h.innerHTML="&#9655;",h.classList.add("play-button"),h.addEventListener("click",(()=>{if(m.paused){if(t&&t!==m){t.pause(),t.currentTime=0;const e=t.closest(".song-carded").querySelector(".play-button");e&&(e.innerHTML="&#9655;")}m.play(),h.innerHTML="&#10073; &#10073;",t=m}else m.pause(),h.innerHTML="&#9655;"})),m.addEventListener("ended",(()=>{h.innerHTML="&#9655;"}));const y=document.createElement("div");y.classList.add("del-pick-container");const g=document.createElement("button");g.classList.add("delete-button"),g.innerHTML="🗑️",g.addEventListener("click",(()=>{l.remove(),o.classList.remove("selected"),o.innerHTML="Select",o.disabled=!1,s()}));const f=document.createElement("input");f.type="checkbox",f.classList.add("pickButton"),l.addEventListener("click",(e=>{e.target.classList.contains("play-button")||e.target.classList.contains("delete-button")||(f.checked=!f.checked)})),p.appendChild(h),u.appendChild(p),l.appendChild(d),l.appendChild(m),l.appendChild(u),y.appendChild(g),y.appendChild(f),l.appendChild(y),e.appendChild(l),s(),o.classList.add("selected"),o.innerHTML="&#9989; Selected",o.disabled=!0}))})),document.addEventListener("DOMContentLoaded",(function(){const e=document.querySelector(".after-loading"),t=document.getElementById("loading-audio"),n=document.getElementById("lyrics"),o=document.getElementById("close-after-loading");e.style.display="block";const i=[{time:65,text:" Take my hand "},{time:69,text:" Believe me when I say "},{time:73,text:" I am here for you always "},{time:78,text:" Take my hand "},{time:81,text:" And Everything could change "},{time:83,text:" But one thing stays the same "},{time:87,text:" I'm here for you always "}];function a(e){n.innerHTML="";e.text.split(" ").forEach(((e,t)=>{const o=document.createElement("span");o.textContent=e+" ",o.style.animationDelay=.2*t+"s",o.style.animationDuration="3s",n.appendChild(o)}))}function s(){const e=document.getElementById("magicEffect");e&&(e.scrollIntoView({behavior:"smooth"}),setTimeout((()=>{window.scrollBy({top:0,behavior:"smooth"})}),500))}function r(){t.pause(),e.style.display="none",window.scrollTo({top:0,behavior:"smooth"})}s(),setTimeout((function(){t.currentTime=65,t.play(),s()}),500),t.addEventListener("timeupdate",(function(){const e=Math.floor(t.currentTime),n=i.find((t=>e===t.time));n&&a(n)})),t.addEventListener("timeupdate",(function(){t.currentTime>=92&&(t.pause(),e.style.display="none",s())}));const c=window.performance.getEntriesByType("navigation")[0]?.type;if("reload"===c||"back_forward"===c){(""===window.location.hash||"#home"===window.location.hash)&&"block"===e.style.display&&s()}o.addEventListener("click",(function(){r()})),window.addEventListener("beforeunload",(function(n){e.style.display="block";const o=[{time:65,text:" Take my hand "},{time:69,text:" Believe me when I say "},{time:73,text:" I am here for you always "},{time:78,text:" Take my hand "},{time:81,text:" And Everything could change "},{time:83,text:" But one thing stays the same "},{time:87,text:" I'm here for you always "}];setTimeout((function(){t.currentTime=65,t.play(),s()}),500),t.addEventListener("timeupdate",(function(){const e=Math.floor(t.currentTime),n=o.find((t=>e===t.time));n&&a(n)})),a(lyric)}))})),document.addEventListener("DOMContentLoaded",(()=>{let e=null;const t=(t,n)=>{document.querySelectorAll(".song-card audio").forEach((e=>{e.paused||(e.pause(),e.currentTime=0,e.closest(".song-card").querySelector(".all-button-container button:nth-of-type(1)").innerHTML="&#9654;")}));const o=document.createElement("div");o.classList.add("try-slideshow-overlay");const i=document.createElement("div");i.classList.add("trial-content");for(let e=0;e<3;e++){const t=document.createElement("div");t.classList.add("trial-div"),t.style.animationDelay=0*e+"s",i.appendChild(t)}const a=document.createElement("button");a.classList.add("trial-close"),a.innerText="X",a.addEventListener("click",(()=>{clearInterval(m),u.pause(),u.currentTime=0,o.remove()})),i.appendChild(a);const s=document.createElement("div");s.classList.add("trial-visualizer"),o.appendChild(s),o.appendChild(i),document.body.appendChild(o);let r=0;const c=document.querySelectorAll(".trial-div"),l=["animation-1","animation-2","animation-3","animation-4","animation-5","animation-6","animation-7","animation-8","animation-9","animation-10"],d=()=>{const e=l[Math.floor(Math.random()*l.length)];c.forEach(((n,o)=>{n.classList.remove(...l),n.classList.add(e),n.style.backgroundImage=`url(${t[r%t.length]})`,n.classList.remove("grayscale")})),c.forEach(((e,t)=>{setTimeout((()=>{e.classList.add("grayscale"),setTimeout((()=>{e.classList.remove("grayscale")}),3e3)}),3e3*t)}))};d();const m=setInterval((()=>{r++,d(),r>=3*t.length&&(clearInterval(m),setTimeout((()=>{u.pause(),u.currentTime=0,o.remove()}),8e3))}),8e3),u=new Audio(n);e=u,u.play(),u.addEventListener("ended",(()=>{clearInterval(m),setTimeout((()=>{o.remove()}),3e3)}));const p=new(window.AudioContext||window.webkitAudioContext),h=p.createAnalyser();p.createMediaElementSource(u).connect(h),h.connect(p.destination);const y=h.frequencyBinCount,g=new Uint8Array(y),f=()=>{requestAnimationFrame(f),h.getByteFrequencyData(g),s.innerHTML="";const e=100/y*2.5;let t,n=0;for(let o=0;o<y;o++){t=g[o]/2;const i=document.createElement("div");i.classList.add("visualizer-bar"),i.style.width=`${e}%`,i.style.height=`${t}px`,i.style.left=`${n}%`,s.appendChild(i),n+=e+.1}};f()};document.addEventListener("click",(e=>{const n=e.target.closest(".all-button-container button:nth-of-type(2)");if(n){const e=n.closest(".song-card").querySelector("audio").src,o=JSON.parse(localStorage.getItem("friends")).map((e=>e.image));t(o,e)}}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("slide-friends"),t=document.querySelector(".selected-song"),n=document.querySelectorAll(".friend-card");e.addEventListener("click",(()=>{t.scrollIntoView({behavior:"smooth"});t.querySelectorAll(".song-carded").forEach((e=>{const t=e.querySelector('input[type="checkbox"]'),n=e.querySelector("audio"),o=e.querySelector(".play-button");t&&(t.checked=!1),n&&(n.pause(),n.currentTime=0,n.loop=!1),o&&(o.innerHTML="&#9655;")})),n.forEach((e=>{const t=e.querySelector('input[type="checkbox"]');t&&(t.checked=!1,t.style.display="none")}))}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("done-button"),t=document.getElementById("pal-name"),n=document.getElementById("friend-heading"),o=document.querySelector(".font-picker").querySelectorAll(".font-option");let i="Impact";const a=document.querySelector(".file-label"),s=document.getElementById("add-image"),r=document.getElementById("preview-image"),c=JSON.parse(localStorage.getItem("friends"))||[{name:"Dwayne Joseph",img:"logo.ng"},{name:"Lydia Hialy",img:"logo.png"},{name:"Vin Mulinka",img:"logo.png"}],l=(o,i)=>{const s=document.querySelectorAll(".pal");o.classList.contains("selected")?(s.forEach((e=>{e.classList.remove("disabled")})),o.classList.remove("selected"),t.textContent="",n.textContent="Select one friend",e.disabled=!0,a.classList.remove("disabled")):(s.forEach((e=>{e!==o&&e.classList.add("disabled")})),o.classList.add("selected"),t.textContent=i,n.textContent="One word that describes your friend",e.disabled=!1,a.classList.add("disabled"))},d=()=>{const e=document.getElementById("word-input").value.toUpperCase().replace(/[^\w\s]/gi,""),t=document.getElementById("error-message"),n=document.getElementById("done-button"),a=document.getElementById("word-input");if(a.addEventListener("input",(()=>{""===a.value.trim()?(t.textContent="Please enter a word.",t.style.display="block",n.disabled=!0):(t.style.display="none",n.disabled=!1)})),a.addEventListener("keydown",(e=>{"Enter"===e.code&&(e.preventDefault(),d())})),0===e.trim().length)return t.textContent="Please enter a word.",t.style.display="block",void(n.disabled=!0);if(t.style.display="none",n.disabled=!1,e.length>25)return t.textContent="The word should be 25 characters or less and without punctuation.",t.style.display="block",void(n.disabled=!0);t.style.display="none";const s=document.querySelector(".pal.selected"),r=document.getElementById("preview-image").querySelector("img");if(!s&&!r)return t.textContent="Please select a friend.",t.style.display="block",void(n.disabled=!0);t.style.display="none";const c=s?s.querySelector("img").src:r.src,l=document.getElementById("output");l.innerHTML="",o.forEach((e=>{e.addEventListener("click",(()=>{i=e.dataset.font,o.forEach((e=>e.classList.remove("selected"))),e.classList.add("selected")}))}));for(let t of e){const e=document.createElement("div");e.className="letter",e.textContent=t,e.style.backgroundImage=`url(${c})`,e.style.fontFamily=i,l.appendChild(e)}const u=document.createElement("button");u.id="download-buttoned",u.textContent="Download Magic",u.addEventListener("click",m),l.appendChild(u)},m=()=>{const e=document.querySelector(".pal.selected"),t=document.getElementById("preview-image").querySelector("img"),n=e?e.querySelector("img").src:t.src;if(!(t&&"#"!==t.src||e))return void alert("No image selected or invalid image source.");const o=document.getElementById("download-buttoned");o.disabled=!0,o.textContent="Hold on",o.classList.add("disabled");const a=new Image;a.crossOrigin="Anonymous",a.onload=()=>{const e=document.getElementById("output"),t=Array.from(e.getElementsByClassName("letter")),n=t.reduce(((e,t)=>e+1.2*t.offsetWidth+10),0),s=1.5*t[0].offsetHeight,r=document.createElement("canvas"),c=r.getContext("2d");r.width=n,r.height=s,r.classList.add("canvas-bg"),r.dataset.type="blackBg",c.fillStyle="black",c.fillRect(0,0,r.width,r.height);const l=document.createElement("canvas"),d=l.getContext("2d");l.width=n,l.height=s,l.classList.add("canvas-bg"),l.dataset.type="noOutline",d.fillStyle="white",d.fillRect(0,0,l.width,l.height);const m=document.createElement("canvas"),u=m.getContext("2d");m.width=n,m.height=s,m.classList.add("canvas-bg"),m.dataset.type="imageBg",u.drawImage(a,0,0,m.width,m.height);let p=0;t.forEach(((e,t)=>{const n=document.createElement("canvas"),m=n.getContext("2d"),h=1.2*e.offsetWidth+10;n.width=h,n.height=s;try{m.drawImage(a,0,0,n.width,n.height);const t="bolder";m.font=`${t} 80px ${i}`,m.textAlign="center",m.textBaseline="middle",n===r?m.fillText(e.textContent,n.width/2,n.height/2):n===l?(m.strokeStyle="white",m.lineWidth=2,m.strokeText(e.textContent,n.width/2,n.height/2)):(m.strokeStyle="black",m.lineWidth=2,m.strokeText(e.textContent,n.width/2,n.height/2),m.globalCompositeOperation="destination-in",m.fillText(e.textContent,n.width/2,n.height/2)),m.globalCompositeOperation="destination-in",m.fillText(e.textContent,n.width/2,n.height/2),m.shadowColor="rgba(0, 0, 0, 0.9)",m.shadowOffsetX=1,m.shadowOffsetY=1,m.shadowBlur=2,c.drawImage(n,p,0),u.drawImage(n,p,0),d.drawImage(n,p,0),p+=h}catch(e){console.error("DOMException while drawing:",e.message),o.textContent="Try again later",o.disabled=!0}}));const h=document.createElement("div");h.classList.add("confirm-overlayed");const y=document.createElement("button");y.innerHTML="&times;",y.classList.add("close-button"),y.addEventListener("click",(()=>{h.remove()})),h.appendChild(y);const g=document.createElement("div"),f=new Image;f.src=r.toDataURL("image/png"),g.appendChild(f);const v=document.createElement("button");v.textContent="Download.",v.addEventListener("click",(()=>{const e=document.createElement("a");e.download="magic-word.png",e.href=r.toDataURL("image/png"),e.click(),h.remove()})),g.appendChild(v),h.appendChild(g);const E=document.createElement("div"),w=new Image;w.src=m.toDataURL("image/png"),E.appendChild(w);const L=document.createElement("button");L.textContent="Download.",L.addEventListener("click",(()=>{const e=document.createElement("a");e.download="magic-word-withbg.png",e.href=m.toDataURL("image/png"),e.click(),h.remove()})),E.appendChild(L),h.appendChild(E);const b=document.createElement("div"),x=new Image;x.src=l.toDataURL("image/png"),b.appendChild(x);const C=document.createElement("button");C.textContent="Download.",C.addEventListener("click",(()=>{const e=document.createElement("a");e.download="shaped-text-no-outline.png",e.href=l.toDataURL("image/png"),e.click(),h.remove()})),b.appendChild(C),h.appendChild(b),document.body.appendChild(h),o.disabled=!1,o.classList.remove("disabled"),setTimeout((()=>{o.textContent="Download Magic Word"}),5e3)},a.onerror=e=>{console.error("Error loading friend image:",e),o.textContent="Try again later",o.disabled=!1},a.src=n};document.getElementById("done-button").addEventListener("click",d),s.addEventListener("change",(e=>{const t=e.target.files[0];if(t){const e=new FileReader;e.onload=function(e){const t=new Image;t.src=e.target.result,t.onload=function(){r.style.display="block",r.innerHTML="",r.appendChild(t),d()}},e.readAsDataURL(t)}})),o.forEach((e=>{e.addEventListener("click",(()=>{i=e.dataset.font,o.forEach((e=>e.classList.remove("selected"))),e.classList.add("selected")}))})),(()=>{const e=document.querySelector(".list-of-pals");e.innerHTML="",c.forEach((t=>{const n=document.createElement("div");n.className="pal",n.innerHTML=`<img src="${t.image}" alt="${t.name}"><span>${t.name}</span>`,n.addEventListener("click",(()=>l(n,t.name))),e.appendChild(n)}))})()})),document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("myCanvas"),t=new THREE.WebGLRenderer({canvas:e}),n=new THREE.Scene,o=new THREE.PerspectiveCamera(75,e.clientWidth/e.clientHeight,.1,1e3);o.position.z=5;const i=JSON.parse(localStorage.getItem("friends"))||[],a=JSON.parse(localStorage.getItem("myself")),s=a.image||"logo2.png",r={Joyful:"😊",Grateful:"🙏",Excited:"😃",Inspired:"🌟",Supportive:"🤝",Amused:"😂",Comforted:"🤗",Appreciative:"👍",Lovely:"💖",Cherished:"💝",Happy:"😁"};const c=[],l=4,d=5,m=`Art by ${a.facebookName}`;let u,p=!1;const h=(new THREE.TextureLoader).load("magic5.png"),y=new THREE.BoxGeometry(l,l,l),g=new THREE.MeshBasicMaterial({map:h}),f=new THREE.Mesh(y,g);f.position.x=-c.length*d,c.push(f),n.add(f);const v=new THREE.CanvasTexture(ae("Magical Friend")),E=new THREE.BoxGeometry(l,l,l),w=new THREE.MeshBasicMaterial({map:v,color:"white"}),L=new THREE.Mesh(E,w);L.position.x=-c.length*d,c.push(L),n.add(L);const b=new THREE.CanvasTexture(ae("Presents")),x=new THREE.BoxGeometry(l,l,l),C=new THREE.MeshBasicMaterial({map:b,color:"red"}),S=new THREE.Mesh(x,C);S.position.x=-(c.length*d+l),c.push(S),n.add(S);const T=new THREE.CanvasTexture(ae(m)),M=new THREE.BoxGeometry(l,l,l),I=new THREE.MeshBasicMaterial({map:T,color:"white"}),k=new THREE.Mesh(M,I);k.position.x=-(c.length*d+l),c.push(k),n.add(k);const B=(new THREE.TextureLoader).load(s),H=new THREE.BoxGeometry(l,l,l),$=new THREE.MeshBasicMaterial({map:B}),q=new THREE.Mesh(H,$);q.position.x=-(c.length*d+l),c.push(q),n.add(q),i.forEach(((e,t)=>{const o=e.image,i=e.emotion||"Just a Friend",a=`${e.name}\n${function(e){const t=e.trim().toLowerCase(),n=Object.keys(r).find((e=>e.toLowerCase()===t));return n?`${r[n]} ${n} ${r[n]}`:"🙂 Just a Friend 🙂"}(i)}`,s=new THREE.CanvasTexture(function(e){const t=document.createElement("canvas"),n=t.getContext("2d");t.width=512,t.height=512,n.fillStyle="#007bff",n.fillRect(0,0,t.width,t.height),n.fillStyle="white",n.font="bold 48px Comic Sans MS",n.textAlign="center",n.textBaseline="middle";const o=10;n.lineWidth=o,n.strokeStyle="white",n.strokeRect(0,0,t.width,t.height);const i=t.width-2*o,a=se(n,e,i),s=60;return a.forEach(((e,o)=>{n.fillText(e,t.width/2,t.height/2-a.length/2*s+o*s)})),t}(a)),m=new THREE.BoxGeometry(l,l,l),u=new THREE.MeshBasicMaterial({map:s}),p=new THREE.Mesh(m,u);p.position.x=-(c.length*d+l),c.push(p),n.add(p);const h=(new THREE.TextureLoader).load(o),y=new THREE.BoxGeometry(l,l,l),g=new THREE.MeshBasicMaterial({map:h}),f=new THREE.Mesh(y,g);f.position.x=-(c.length*d+l),c.push(f),n.add(f)}));const R=(new THREE.TextureLoader).load("logo.png"),A=new THREE.BoxGeometry(l,l,l),W=new THREE.MeshBasicMaterial({map:R}),D=new THREE.Mesh(A,W);D.position.x=-(c.length*d+l),c.push(D),n.add(D);const O=`Top ${i.length} friends. of ${a.facebookName}`,P=new THREE.CanvasTexture(function(e){const t=document.createElement("canvas"),n=t.getContext("2d");t.width=512,t.height=512,n.fillStyle="#007bff",n.fillRect(0,0,t.width,t.height),n.fillStyle="white",n.font='48px "Comic Sans MS", cursive, sans-serif',n.textAlign="center",n.textBaseline="middle";n.lineWidth=10,n.strokeStyle="white",n.strokeRect(0,0,t.width,t.height);const o=t.width-20,i=se(n,e,o);return i.forEach(((e,o)=>{n.fillText(e,t.width/2,t.height/2-i.length/2*60+60*o)})),t}(O)),U=new THREE.BoxGeometry(l,l,l),F=new THREE.MeshBasicMaterial({map:P,color:"gold"}),j=new THREE.Mesh(U,F);j.position.x=-(c.length*d+l),c.push(j),n.add(j),window.addEventListener("resize",(function(){o.aspect=e.clientWidth/e.clientHeight,o.updateProjectionMatrix(),t.setSize(e.clientWidth,e.clientHeight)}));let N=null;const z=.02;let G=[],J=new Audio("y2mate.com - Hans Zimmer  Reunion Love Found Us.mp3");const Y=[{src:"y2mate.com - 02 Hans Zimmer  Spirit Stallion of the Cimarron  Swimming.mp3",startAt:30},{src:"y2mate.com - Hans Zimmer  Time Official Audio.mp3",startAt:60},{src:"y2mate.com - Crystal Skies  Release Me Lyrics feat Gallie Fisher.mp3",startAt:20},{src:"y2mate.com - Jim Yosef  Let You Go  Synthpop  NCS  Copyright Free Music.mp3",startAt:30}];let V=0;function _(){N=requestAnimationFrame(_);const i=document.querySelector(".overlay-counter"),s=window.getComputedStyle(i),r=performance.now();G.push(r),c.forEach((e=>{e.position.x+=z})),t.render(n,o),u&&u.capture(e),Math.abs(j.position.x)<z&&(cancelAnimationFrame(N),N=null,ie(),X.innerHTML="&#9655;",p||(!function(){const e=document.getElementById("downloaddiv"),t=document.getElementById("logoImage"),n=document.getElementById("userphoto"),o=document.getElementById("downloadButtoned"),i=document.getElementById("closeButton"),a=document.getElementById("agreeCheckbox"),s=document.getElementById("userNames"),r=JSON.parse(localStorage.getItem("myself"));r&&r.image?n.src=r.image:n.src="logo.png";r&&r.facebookName?s.textContent=r.facebookName:s.textContent="Lorem Ipsum";t.src="magic5.png",e.style.display="flex",a.addEventListener("change",(function(){a.checked?(o.disabled=!1,agreeLabel.textContent="Agreed",agreeLabel.style.color="gold"):(o.disabled=!0,agreeLabel.innerHTML='<input type="checkbox" id="agreeCheckbox"> I agree',document.getElementById("agreeCheckbox").addEventListener("change",this))})),o.addEventListener("click",(function(){if(!o.disabled){document.querySelector(".progressText").innerHTML+=`<p>Thankyou, ${r.facebookName} for being with Magical Friend</p>`,e.style.display="none",function(){const e=document.querySelector(".overlay-counter");e.style.display="flex"}(),u=new CCapture({format:"webm",framerate:60,verbose:!0,quality:100}),u.start(),re(),_(),oe(),X.innerHTML="&#9723;"}})),i.addEventListener("click",(function(){e.style.display="none"}))}(),p=!0),"flex"===s.getPropertyValue("display")&&(ce(),ie()),u&&(u.stop(),u.save((e=>{const t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`magical_friend_${a.facebookName} _video.webm`,t.click(),function(e){const t=document.createElement("div");t.id="showVideoOverlay",t.style.position="fixed",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.style.zIndex="1000",t.style.backgroundColor="rgba(0, 0, 0, 0.8)",t.style.padding="20px",t.style.borderRadius="10px",t.style.textAlign="center";const n=document.createElement("video");n.controls=!0,n.src=URL.createObjectURL(e),n.style.width="100%",n.style.maxWidth="600px",n.style.borderRadius="10px";const o=document.createElement("button");o.textContent="Close",o.style.marginTop="10px",o.addEventListener("click",(function(){document.body.removeChild(t)})),t.appendChild(n),t.appendChild(o),document.body.appendChild(t)}(e),ce()})),u=null,cancelAnimationFrame(N)),J.currentTime=30)}const X=document.getElementById("magic-play");J.loop=!0;let Z=!1,K=!1,Q=0,ee=!1,te=0;function ne(){V++,V>=Y.length&&(V=0),J?(J.pause(),J.currentTime=0,J.src=Y[V].src,J.currentTime=Y[V].startAt):(J=new Audio(Y[V].src),J.currentTime=Y[V].startAt,J.loop=!0,J.addEventListener("ended",ne)),J.play()}function oe(e=!1){J.currentTime=e?30:Q,J.play(),Z=!0}function ie(){Q=J.currentTime,J.pause(),Z=!1}function ae(e){const t=document.createElement("canvas"),n=t.getContext("2d");t.width=512,t.height=512,n.fillStyle="#007bff",n.fillRect(0,0,t.width,t.height),n.fillStyle="white",n.font="bold 48px Comic Sans MS",n.textAlign="center",n.textBaseline="middle";n.lineWidth=10,n.strokeStyle="white",n.strokeRect(0,0,t.width,t.height);const o=t.width-20,i=se(n,e,o);return i.forEach(((e,o)=>{n.fillText(e,t.width/2,t.height/2-i.length/2*60+60*o)})),t}function se(e,t,n){const o=t.split(" ");let i=[],a=o[0];for(let t=1;t<o.length;t++){const s=o[t];e.measureText(a+" "+s).width<n?a+=" "+s:(i.push(a),a=s)}return i.push(a),i}function re(){c.forEach(((e,t)=>{e.position.x=-(t*d+l)})),Q=0,J.currentTime=30,ee=!1}function ce(){document.querySelector(".overlay-counter").style.display="none"}X.addEventListener("click",(function(){c.some((e=>0!==e.position.x))?(te++,1===te&&(re(),J.currentTime=60,K=!1,ee=!1),N?(cancelAnimationFrame(N),N=null,ie(),X.innerHTML="&#9654;"):(Math.abs(j.position.x)<z&&re(),K?(_(),oe(!ee),X.innerHTML="&#9723;"):(J.addEventListener("loadedmetadata",(function(){K=!0,oe(!ee),_(),X.innerHTML="&#9723;"})),J.load())),ee=!0):location.reload()})),J.addEventListener("ended",(function(){null!==N&&ne()})),J.addEventListener("stalled",(function(){N&&(cancelAnimationFrame(N),N=null,X.innerHTML="&#9655;")})),window.addEventListener("blur",(function(){N&&(cancelAnimationFrame(N),N=null,ie(),X.innerHTML="&#9655;",u.stop(),J.pause())})),window.addEventListener("focus",(function(){!N&&Z&&(_(),X.innerHTML="&#9723;",u.start(),oe(!ee))}))})),document.addEventListener("DOMContentLoaded",(function(){var e,t,n=document.getElementById("memoriesCalendar"),o=document.getElementById("eventsCalendar"),i=document.getElementById("customPromptModal"),a=document.getElementById("customPromptInput"),s=document.getElementById("customPromptConfirm"),r=document.getElementById("customPromptCancel"),c=document.querySelector(".memory-title"),l=document.getElementById("memoryInput"),d=document.getElementById("saveMemory"),m=document.getElementById("memoriesList"),u=document.getElementById("owner-names"),p=!0;(JSON.parse(localStorage.getItem("memories"))||[]).forEach((function(e){var t=document.createElement("div");t.classList.add("memory-item");var n=document.createElement("h4");n.textContent=e.title,t.appendChild(n);var o=document.createElement("p");o.textContent=e.content,t.appendChild(o);var i=document.createElement("p");i.textContent="Memory Day: "+e.date,t.appendChild(i);var a=(new Date).toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),s=document.createElement("p");s.textContent="Updated: "+(new Date).toLocaleDateString()+", "+a,t.appendChild(s);const r=document.createElement("div");r.classList.add("edit-container"),t.appendChild(r);var c=document.createElement("span");c.innerHTML="✏️",c.classList.add("edit-icon"),c.addEventListener("click",(function(){E("edit "+e.title)})),r.appendChild(c);var l=document.createElement("span");l.innerHTML="🗑️",l.classList.add("delete-icon"),l.addEventListener("click",(function(){E("delete "+e.title)})),r.appendChild(l),m.appendChild(t)}));var h=JSON.parse(localStorage.getItem("myself"));function y(n,o){i.style.display="flex",a.value="",a.focus(),e=n,t=o,p=!1}function g(){i.style.display="none",e=null,t=null}u.textContent=h.facebookName,s.addEventListener("click",(function(){var n=a.value.trim(),o=e.start.toLocaleDateString("en-US");n&&e&&t&&(t.addEvent({title:n,start:e.startStr,end:e.endStr,allDay:e.allDay}),c.innerHTML=o+" "+n),g()})),r.addEventListener("click",(function(){g(),p=!0}));var f=new FullCalendar.Calendar(n,{initialView:"dayGridMonth",headerToolbar:{left:"prev,next today",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay"},selectable:!0,select:function(e){p&&new Date(e.startStr)<=new Date&&y(e,f)},events:[]}),v=new FullCalendar.Calendar(o,{initialView:"dayGridMonth",headerToolbar:{left:"prev,next today",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay"},selectable:!0,select:function(e){new Date(e.startStr)>=new Date&&y(e,v)},events:[]});function E(e){var t=document.getElementById("confirmText"),n=document.getElementById("confirm-overlay"),o=document.getElementById("memoriesList"),i=JSON.parse(localStorage.getItem("memories"))||[];t.textContent=`Are you sure you want to ${e} this memory?`,n.style.display="block",e.trim().startsWith("delete")?document.getElementById("confirmYes").onclick=function(){var t=e.replace("delete ",""),a=Array.from(o.getElementsByClassName("memory-item")).find((function(e){return e.querySelector("h4").textContent===t}));a&&o.removeChild(a),i=i.filter((function(e){return e.title!==t})),localStorage.setItem("memories",JSON.stringify(i)),n.style.display="none"}:e.trim().startsWith("edit")&&(document.getElementById("confirmYes").onclick=function(){var t=e.replace("edit ",""),a=i.find((function(e){return e.title===t}));if(a){var s=document.createElement("div");s.classList.add("edit-form"),s.innerHTML=`\n                     <input type="text" id="editMemoryTitle" value="${a.title}">\n                    <textarea id="editMemoryContent">${a.content}</textarea>\n                    <label for="editMemoryDate">Memory Date:</label>\n                    <input type="date" id="editMemoryDate" value="${a.date}" max="${(new Date).toISOString().split("T")[0]}">\n                    <button id="editMemorySave">Save</button>\n                    <button id="editMemoryCancel">Cancel</button>\n                    <span class="edit-close">&times;</span>\n                `,document.body.appendChild(s),document.getElementById("editMemorySave").onclick=function(){a.title=document.getElementById("editMemoryTitle").value.trim(),a.content=document.getElementById("editMemoryContent").value.trim();var e=Array.from(o.getElementsByClassName("memory-item")).find((function(e){return e.querySelector("h4").textContent===t}));e&&(e.querySelector("h4").textContent=a.title,e.querySelector("p").textContent=a.content,e.querySelector("p:nth-child(3)").innerHTML=`<strong>Memory Day:</strong> ${a.date}`),localStorage.setItem("memories",JSON.stringify(i)),s.remove(),n.style.display="none"},document.getElementById("editMemoryCancel").onclick=function(){s.remove(),n.style.display="none"},s.querySelector(".edit-close").onclick=function(){s.remove(),n.style.display="none"}}}),document.getElementById("confirmNo").onclick=function(){n.style.display="none"}}f.render(),v.render(),l.addEventListener("input",(function(){d.disabled=!l.value.trim()})),document.getElementById("saveMemory").addEventListener("click",(function(){var e,t,n,o,i,a=l.value.trim(),s=c.textContent.trim(),r=c.textContent.trim(),u=r.indexOf(" "),h=(s=r.substring(0,u),r.substring(u+1));if(a&&s){var y=document.createElement("div");y.classList.add("memory-item");var g=document.createElement("h4");g.textContent=h,y.appendChild(g);var f=document.createElement("p");f.textContent=a,y.appendChild(f);var v=document.createElement("p");v.innerHTML="<strong>Memory Day:</strong> "+s,y.appendChild(v);var w=(new Date).toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),L=document.createElement("p");L.innerHTML="<b>Updated:</b> "+(new Date).toLocaleDateString()+", "+w,y.appendChild(L);const r=document.createElement("div");r.classList.add("edit-container"),y.appendChild(r);var b=document.createElement("span");b.innerHTML="✏️",b.classList.add("edit-icon"),r.appendChild(b),b.addEventListener("click",(function(){E("edit "+h)}));var x=document.createElement("span");x.innerHTML="🗑️",x.classList.add("delete-icon"),r.appendChild(x),x.addEventListener("click",(function(){E("delete "+h)})),m.appendChild(y),l.value="",c.textContent="",d.disabled=!0,p=!0,e=s,t=h,n=a,o=JSON.parse(localStorage.getItem("memories"))||[],i={date:e,title:t,content:n},o.push(i),localStorage.setItem("memories",JSON.stringify(o)),window.location.reload()}})),document.getElementById("setReminder").addEventListener("click",(function(){var e=document.getElementById("reminderText").value,t=document.getElementById("reminderDate").value;if(e&&t){var n=document.createElement("div");n.textContent=e+" - "+new Date(t).toLocaleString(),document.getElementById("alertsList").appendChild(n),document.getElementById("reminderText").value="",document.getElementById("reminderDate").value=""}})),g()})),document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("grid-memories"),t=document.getElementById("column-memories"),n=document.getElementById("memoriesList");function o(e){document.querySelectorAll(".sort-memories a i").forEach((e=>e.classList.remove("active"))),e.classList.add("active")}e.addEventListener("click",(function(){n.classList.remove("column-layout"),n.classList.add("grid-layout"),o(e.querySelector("i"))})),t.addEventListener("click",(function(){n.classList.remove("grid-layout"),n.classList.add("column-layout"),o(t.querySelector("i"))}))})),document.addEventListener("DOMContentLoaded",(function(){let e=!1;document.getElementById("show-memory-slideshow").addEventListener("click",(function(){e=!e;const t=this;e?(t.innerHTML="magical memories ▲",document.querySelector(".processing-memories").classList.add("show"),setTimeout((function(){const n=(JSON.parse(localStorage.getItem("memories"))||[]).length,o=document.querySelector(".processing-message");0===n?(o.textContent="You have 0 memories. Please add to see the magic.",setTimeout((()=>{document.querySelector(".processing-memories").classList.remove("show"),t.innerHTML="magical memories ▼",e=!1}),3e3)):n<3?(o.textContent="You need at least 3 memories to see the magic.",setTimeout((()=>{document.querySelector(".processing-memories").classList.remove("show"),t.innerHTML="magical memories ▼",e=!1}),3e3)):(document.querySelector(".processing-memories").classList.remove("show"),document.querySelector(".magical-memories-view").classList.add("show"),animateMemories())}),3e3)):(t.innerHTML="magical memories ▼",document.querySelector(".magical-memories-view").classList.remove("show"),e=!1)}));const t=new THREE.Scene,n=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),o=new THREE.WebGLRenderer({canvas:document.getElementById("myMemories")});o.setSize(window.innerWidth,window.innerHeight);const i=[],a=200,s=100,r=100;function c(e,n,o=!1){const s=window.innerWidth/4+a;e.position.x=s+n*(a+100),t.add(e),i.push(e),o&&(e.userData.hasText=!0)}function l(){const e=window.innerWidth,t=window.innerHeight;n.aspect=e/t,n.updateProjectionMatrix(),o.setSize(e,t);const c=e/4+a;i.forEach(((e,t)=>{e.position.x=c+t*(a+100),e.scale.set(a/200,s/100,r/100)}))}l(),window.addEventListener("resize",l);const d=new THREE.TextureLoader,m=d.load("magic5.png"),u=new THREE.MeshBasicMaterial({map:m});c(new THREE.Mesh(new THREE.BoxGeometry(a,s,r),u),0);c(v("Presents"),1);const p=JSON.parse(localStorage.getItem("myself"));if(p&&p.image){const e=d.load(p.image),t=new THREE.MeshBasicMaterial({map:e});c(new THREE.Mesh(new THREE.BoxGeometry(a,s,r),t),2)}const h=JSON.parse(localStorage.getItem("memories"))||[];h.forEach(((e,t)=>{const n=function(e,t){const n=new THREE.BoxGeometry(a,s,r),o=new THREE.MeshBasicMaterial({color:"blue"}),i=new THREE.Mesh(n,o),c=new THREE.ShaderMaterial({uniforms:{},vertexShader:"\n                    varying vec3 vPos;\n                    void main() {\n                        vPos = position;\n                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                    }\n                ",fragmentShader:"\n                    varying vec3 vPos;\n                    void main() {\n                        float thickness = 0.02; // Adjust border thickness\n                        vec3 color1 = vec3(0.8, 0.2, 0.2); // Soft Red\n                        vec3 color2 = vec3(0.2, 0.8, 0.2); // Soft Green\n                        vec3 color3 = vec3(0.2, 0.2, 0.8); // Soft Blue\n                        vec3 color4 = vec3(0.8, 0.8, 0.2); // Soft Yellow\n                        vec3 color5 = vec3(0.8, 0.2, 0.8); // Soft Purple\n                        vec3 color = mix(color1, color2, step(0.2, fract(vPos.x * 5.0 + vPos.y * 5.0 + vPos.z * 5.0)));\n                        color = mix(color, color3, step(0.4, fract(vPos.x * 5.0 - vPos.y * 5.0 + vPos.z * 5.0)));\n                        color = mix(color, color4, step(0.6, fract(vPos.x * 5.0 + vPos.y * 5.0 - vPos.z * 5.0)));\n                        color = mix(color, color5, step(0.8, fract(vPos.x * 5.0 - vPos.y * 5.0 - vPos.z * 5.0)));\n                        gl_FragColor = vec4(color, thickness);\n                    }\n                ",side:THREE.BackSide}),l=new THREE.Mesh(n,c);l.scale.multiplyScalar(1.05),i.add(l);const d=v(`${e}`,"bold 72px Comic Sans MS","gold");d.position.y=s/2+10,i.add(d);const m=t.split(" "),u=m.slice(0,20).join(" ")+(m.length>20?"...":""),p=v(u.split("\n").map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join("\n"),"bold 72px Comic Sans MS","white");return p.position.y=0,i.add(p),i}(e.title,e.content);c(function(e){const t=new THREE.BoxGeometry(a,s,r),n=new THREE.MeshBasicMaterial({color:"blue"}),o=new THREE.Mesh(t,n),i=new THREE.ShaderMaterial({uniforms:{},vertexShader:"\n                    varying vec3 vPos;\n                    void main() {\n                        vPos = position;\n                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                    }\n                ",fragmentShader:"\n                    varying vec3 vPos;\n                    void main() {\n                        float thickness = 0.02; // Adjust border thickness\n                        vec3 color1 = vec3(0.8, 0.2, 0.8); // Soft Red\n                        vec3 color2 = vec3(0.2, 0.8, 0.2); // Soft Green\n                        vec3 color3 = vec3(0.2, 0.2, 0.8); // Soft Blue\n                        vec3 color4 = vec3(0.8, 0.8, 0.2); // Soft Yellow\n                        vec3 color5 = vec3(0.8, 0.2, 0.8); // Soft Purple\n                        vec3 color = mix(color1, color2, step(0.2, fract(vPos.x * 5.0 + vPos.y * 5.0 + vPos.z * 5.0)));\n                        color = mix(color, color3, step(0.4, fract(vPos.x * 5.0 - vPos.y * 5.0 + vPos.z * 5.0)));\n                        color = mix(color, color4, step(0.6, fract(vPos.x * 5.0 + vPos.y * 5.0 - vPos.z * 5.0)));\n                        color = mix(color, color5, step(0.8, fract(vPos.x * 5.0 - vPos.y * 5.0 - vPos.z * 5.0)));\n                        gl_FragColor = vec4(color, thickness);\n                    }\n                ",side:THREE.BackSide}),c=new THREE.Mesh(t,i);c.scale.multiplyScalar(1.05),o.add(c);const l=v(`${function(e){const t=e.split("/"),n=parseInt(t[1],10),o=parseInt(t[0],10)-1,i=parseInt(t[2],10),a=new Date(i,o,n),s={day:"numeric",month:"long",year:"numeric"},r=a.toLocaleDateString("en-US",s);return r}(e)}`,"bold 72px Comic Sans MS","cyan");return l.position.y=0,o.add(l),o}(e.date),3+2*t),c(n,3+2*t+1,!0)}));const y=d.load("logo.png"),g=new THREE.MeshBasicMaterial({map:y}),f=new THREE.Mesh(new THREE.BoxGeometry(a,s,r),g);function v(e,t="bold 72px Comic Sans MS",n="white"){const o=document.createElement("canvas"),i=o.getContext("2d");o.width=1024,o.height=512,i.clearRect(0,0,o.width,o.height),i.fillStyle=n,i.font=t,i.textAlign="center",i.textBaseline="middle";const c=function(e,t){const n=e.split(" "),o=[];let i="";n.forEach((e=>{if(e.length>t){const n=e.substring(0,t-3)+"...";i.length>0&&(o.push(E(i.trim())),i=""),o.push(n)}else{const n=0===i.length?e:`${i} ${e}`;n.length<=t?i=n:(o.push(E(i.trim())),i=e)}})),i.length>0&&o.push(E(i.trim()));return o}(e,20),l=(o.height-100*c.length)/2;c.forEach(((e,t)=>{i.fillText(e,o.width/2,l+100*t)}));const d=new THREE.CanvasTexture(o);d.minFilter=THREE.LinearFilter,d.magFilter=THREE.LinearFilter,d.wrapS=THREE.ClampToEdgeWrapping,d.wrapT=THREE.ClampToEdgeWrapping;const m=new THREE.MeshBasicMaterial({map:d}),u=new THREE.BoxGeometry(a,s,r);return new THREE.Mesh(u,m)}function E(e){return e.charAt(0).toUpperCase()+e.slice(1)}c(f,3+2*h.length),n.position.z=200;let w=!1,L=null,b=!1,x=0;let C=document.getElementById("default-song"),S=!1,T=0;const M=[{audio:"y2mate.com - How Does A Moment Last Forever  Celine Dion Lyrics.mp3",timeToStart:8},{audio:"y2mate.com - Crystal Skies  Release Me Lyrics feat Gallie Fisher.mp3",timeToStart:23},{audio:"y2mate.com - Diviners  Savannah feat Philly K  Tropical House  NCS  Copyright Free Music.mp3",timeToStart:116},{audio:"y2mate.com - Diviners Riell  Slow Official Lyric Video.mp3",timeToStart:122},{audio:"y2mate.com - Culture Code  Make Me Move feat Karra  Dance Pop  NCS  Copyright Free Music.mp3",timeToStart:120},{audio:"y2mate.com - John Powell  Hans Zimmer  Homeland  Spirit.mp3",timeToStart:212}];function I(){if(L=requestAnimationFrame(I),!w)return;let e=!0;i.forEach((t=>{t.position.x-=.4,t.userData.hasText&&(t.rotation.y+=.004,t.rotation.y*=.95),t.position.x+a/2>0&&(e=!1),t===f&&t.position.x<=0&&!b&&(b=!0,cancelAnimationFrame(L),C.pause(),C.currentTime=0,k.innerHTML=w?"&#9654;":"&#10074;&#10074;",q(),function(){const e=document.getElementById("showOverlayButton");e.style.display="block",e.disabled=!1}())})),o.render(t,n),e&&(b=!1)}const k=document.getElementById("play-memories");function B(){k.innerHTML="&#8635;",cancelAnimationFrame(L),C.pause()}function H(e){const t=document.getElementById("notificationed-container");document.getElementById("notificationed-message").textContent=e,t.classList.add("show"),setTimeout((()=>{t.classList.remove("show")}),6e3)}function $(){const e=document.getElementById("chosen-song").files[0];if(e)C.src=URL.createObjectURL(e),S=!0,H(`Playing... ${e.name}`);else{const e=document.querySelector(".other-songs li.selected");e?(C.src=e.dataset.song,S=!0,H(`Playing... ${e.textContent}`)):(C.src=document.getElementById("default-song").src,S=!1,H("Now playing... "))}C.dataset.currentTime&&(C.currentTime=parseFloat(C.dataset.currentTime),delete C.dataset.currentTime),C.play()}function q(){document.querySelectorAll(".other-songs li").forEach((e=>{e.style.pointerEvents="auto"}))}k.addEventListener("click",(()=>{"&#8635;"===k.innerHTML&&window.location.reload(!0)})),C.addEventListener("stalled",B),C.addEventListener("error",B),C.addEventListener("ended",(()=>{if(H("Audio ended"),w)if(T<M.length){const e=M[T];C.src=e.audio,C.currentTime=e.timeToStart,C.play(),T++,S=!0,H(`Switched to ${e.audio}...`)}else C.src=document.getElementById("default-song").src,C.currentTime=212,C.loop=!0,C.play(),S=!1,H("Switched to default song...");else H("We hoped you enjoyed...")})),C.addEventListener("playing",(()=>{setTimeout("Song Playing...",H,2e3)})),k.addEventListener("click",(()=>{if(w)cancelAnimationFrame(L),C.paused||(C.dataset.currentTime=C.currentTime),C.pause(),k.innerHTML="&#9654;",x=0,q(),w=!1;else{if(b&&(i.forEach(((e,t)=>{const n=window.innerWidth/4+a;e.position.x=n+t*(a+100)+100})),b=!1,0===C.currentTime&&(C.currentTime=0)),I(),x>0){if(performance.now()-x>1)return void B()}x=performance.now(),0===C.currentTime?setTimeout($,5e3):$(),k.innerHTML="&#10074;&#10074;",e=!0,document.querySelectorAll(".other-songs li").forEach((t=>{t.style.pointerEvents=e?"none":"auto"})),function(){const e=document.getElementById("showOverlayButton");e.style.display="none",e.disabled=!1}(),w=!0}var e})),document.getElementById("chosen-song").addEventListener("change",(()=>{const e=document.getElementById("chosen-song").files[0];if(e){const t=document.querySelector(".other-songs ul"),n=document.createElement("li");n.textContent=e.name,n.dataset.song=URL.createObjectURL(e),n.classList.add("uploaded"),t.appendChild(n),document.querySelectorAll(".other-songs li").forEach((e=>{e.style.pointerEvents=w?"none":"auto"}))}document.querySelector(".othersong-overlay").classList.remove("show")})),document.querySelectorAll(".other-songs li").forEach((e=>{e.addEventListener("click",(()=>{document.querySelectorAll(".other-songs li").forEach((e=>e.classList.remove("selected"))),e.classList.add("selected"),document.querySelector(".othersong-overlay").classList.remove("show")}))})),document.getElementById("closeOtherOverlay").addEventListener("click",(()=>{document.querySelector(".othersong-overlay").classList.remove("show")})),document.getElementById("showOverlayButton").addEventListener("click",(function(){document.querySelector(".othersong-overlay").classList.add("show")}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("magic-friend-about"),t=document.getElementById("closeBtn"),n=document.getElementById("friendImage"),o=document.getElementById("friendName"),i=document.getElementById("friendEmotion"),a=document.getElementById("friendDescription"),s=document.getElementById("characterDisplay");let r="";const c={Joyful:"😊",Grateful:"🙏",Excited:"😃",Inspired:"🌟",Supportive:"🤝",Amused:"😂",Comforted:"🤗",Appreciative:"👍",Lovely:"💖",Cherished:"💝",Happy:"😁"};function l(){const t=JSON.parse(localStorage.getItem("friends")).find((e=>e.name.toLowerCase().includes(r)));if(t){n.src=t.image,o.textContent=t.name;const s=t.emotion.trim().toLowerCase(),r=Object.keys(c).find((e=>e.toLowerCase()===s)),l=r?`${c[r]} ${r}`:"🙂 Just a Friend 🙂";i.innerHTML=`How i feel about ${t.name}<br>${l}`,a.textContent=t.description,e.style.display="flex"}else e.style.display="none"}document.addEventListener("keypress",(t=>{if("INPUT"!==document.activeElement.tagName&&"TEXTAREA"!==document.activeElement.tagName){const n=t.key;if("Enter"===n)return r="",s.textContent="",void(e.style.display="none");if(" "===n)return;r+=n.toLowerCase(),s.textContent=r,console.log(r),l()}})),document.addEventListener("keydown",(e=>{"INPUT"!==document.activeElement.tagName&&"TEXTAREA"!==document.activeElement.tagName&&("Backspace"!==e.key&&"Delete"!==e.key||(r=r.slice(0,-1),s.textContent=r,console.log(r),l()))})),t.addEventListener("click",(()=>{e.style.display="none",r="",s.textContent=""}))})),document.addEventListener("DOMContentLoaded",(function(){const e=(JSON.parse(localStorage.getItem("friends"))||[]).map((e=>({name:e.name,image:e.image}))),t=[{question:"Do you have any other names or aliases?",type:"text",placeholder:"(e.g., Joe, Xi, Kumar, Nala)",required:!0},{question:"What is your gender?",type:"select",options:["Other","Male","Female"],required:!0},{question:"What is your birth date?",type:"date",required:!0},{question:"What is your country of birth?",type:"text",placeholder:"(e.g., moscow, Russia)",required:!0},{question:"Raised in a family of (siblings)?",type:"number",required:!0},{question:"What is your marital status",type:"select",options:["Single","Married","Unknown"],required:!0},{question:"What is your favorite color?",type:"text",placeholder:"(e.g., Blue, Green)",required:!0},{question:"What is your favorite book?",type:"text",placeholder:"(e.g., The Jungle Book, Hamlet)",required:!0},{question:"What is your profession?",type:"text",placeholder:"(e.g., Teacher, Engineer)",required:!0},{question:"What is your favorite number?",type:"number",required:!0},{question:"What is your hobby or favorite activity?",type:"text",placeholder:"(e.g., Fishing, Painting)",required:!0},{question:"What are your interests in your career?",type:"text",placeholder:"(e.g., Research, Innovation)",required:!0},{question:"What is your belief or principle based on?",type:"select",options:["Christianity","Islam","Hinduism","Buddhism","Judaism","Atheism","Daoism","Other"],required:!0},{question:"What is your source of inspiration?",type:"text",placeholder:"(e.g., Nature, Family)",required:!0},{question:"What is your contribution or goal?",type:"text",placeholder:"(e.g., Helping others, Environmental conservation)",required:!0},{question:"What is your significant achievement?",type:"text",placeholder:"(e.g., Nobel Prize, Record achievement)",required:!0},{question:"Who is your best friend?",type:"select",options:e.map((e=>e.name)),required:!0},{question:"What are your top 3 friends?",type:"checkbox",options:e,required:!0},{question:"What is your favorite movie?",type:"text",placeholder:"(e.g., Inception, Titanic)",required:!0},{question:"What is your favorite food?",type:"text",placeholder:"(e.g., Pizza, Sushi)",required:!0},{question:"What is your dream vacation destination?",type:"text",placeholder:"(e.g., Paris, Maldives)",required:!0},{question:"What is your favorite sport?",type:"text",placeholder:"(e.g., Soccer, Basketball)",required:!0}];let n=0,o={},i=[];const a=document.getElementById("answer-input"),s=document.getElementById("question-display"),r=document.getElementById("ok-btn"),c=document.getElementById("skip-btn"),l=document.getElementById("prev-btn"),d=document.getElementById("next-btn"),m=document.getElementById("done-pedia-btn"),u=document.getElementById("output-pedia"),p=document.getElementById("user-name-pedia"),h=JSON.parse(localStorage.getItem("myself"))?.facebookName||"Magucal Friend",y=document.getElementById("magic-user");function g(){const e=t[n];let u;!function(e,t){t.innerHTML="";const n=document.createElement("div");n.classList.add("typewriter"),t.appendChild(n);let o=0;function i(){o<e.length&&(n.textContent+=e.charAt(o),o++,setTimeout(i,50))}i()}(e.question,s),a.innerHTML="","select"===e.type?(u=document.createElement("select"),e.options.forEach((e=>{const t=document.createElement("option");t.value=e,t.textContent=e,u.appendChild(t)}))):"checkbox"===e.type?(u=document.createElement("div"),u.classList.add("checkbox-container"),e.options.forEach((e=>{const t=document.createElement("label");t.classList.add("checkbox-label");const n=document.createElement("input");n.type="checkbox",n.value=e.name,n.addEventListener("change",(()=>{!function(e){if(e.checked)i.length<3?i.push(e.value):e.checked=!1;else{const t=i.indexOf(e.value);t>-1&&i.splice(t,1)}document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach((e=>{i.includes(e.value)||(e.disabled=i.length>=3&&!e.checked)})),r.disabled=3!==i.length}(n)}));const o=document.createElement("img");o.src=e.image,o.alt=e.name,o.classList.add("friend-image"),t.appendChild(n),t.appendChild(o),t.appendChild(document.createTextNode(e.name)),u.appendChild(t),u.appendChild(document.createElement("br"))}))):"color"===e.type?(u=document.createElement("input"),u.type="color"):(u=document.createElement("input"),u.type=e.type),u.id="answer",u.placeholder=e.placeholder||"Type your answer here...",u.value=o[e.question]||"",u.addEventListener("input",(()=>{r.disabled=""===u.value})),"select"===e.type&&u.addEventListener("change",(()=>{r.disabled=!1})),a.appendChild(u),l.disabled=0===n,c.disabled=n===t.length-1,d.disabled=n===t.length-1,m.style.display=n===t.length-1?"inline-block":"none",r.disabled=!0}function f(){const e=document.querySelector(".magic-pedia"),t=document.createElement("button");t.textContent="Save and Post",t.addEventListener("click",(function(){e.style.display="flex"}));document.getElementById("output-pedia").appendChild(t)}function v(){E(),n<t.length-1&&(n++,g())}function E(){const e=t[n],i=document.getElementById("answer").value;o[e.question]=i}function w(e,t){const n=e.value,i=(e.previousSibling?e.previousSibling.textContent.trim():"").slice(0,-1);o[i]=n,e.replaceWith(t),t.textContent=n,document.querySelectorAll(".emphasized-word").forEach((e=>{const t=e.previousSibling.textContent.trim().slice(0,-1);o[t]&&(e.textContent=o[t])}))}function L(){const e={Male:{subject:"he",object:"him",possessive:"his"},Female:{subject:"she",object:"her",possessive:"her"},Other:{subject:"he/she",object:"him/her",possessive:"his/her"}},a=e[o["What is your gender?"]]||e.Other;let s=o["What is your birth date?"],r="",c="";if("string"==typeof s){if(s=new Date(s),r=s.getFullYear(),isNaN(s.getTime())||r<1900||r>(new Date).getFullYear()-5)return void alert("Invalid birth date:",s);c=s.toLocaleDateString("en-US",{weekday:"long"})}else{if(!(s instanceof Date))return void alert("Invalid birth date:",s);if(r=s.getFullYear(),r<1900||r>(new Date).getFullYear()-5)return void alert("Invalid birth date:",s);c=s.toLocaleDateString("en-US",{weekday:"long"})}const l=o["Who is your best friend?"]||"Magical Friend";!function(e,t,n){t.innerHTML="";const o=document.createElement("div");o.classList.add("typewriter"),t.appendChild(o);let i=0;function a(){i<e.length?(o.textContent+=e.charAt(i),i++,setTimeout(a,50)):n&&"function"==typeof n&&n()}a()}(`\n            ${h} (born ${o["What is your country of birth?"]}, ${s instanceof Date?s.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):s}) is better known as ${o["Do you have any other names or aliases?"]}. Currently marital status: ${o["What is your marital status"]}.\n\n            ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is ${o["What is your profession?"]}. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is ${(new Date).getFullYear()-r} years old. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite color is ${o["What is your favorite color?"]}, and ${a.subject} loves reading ${o["What is your favorite book?"]}. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} profession is ${o["What is your profession?"]}, and ${a.subject} has ${o["Raised in a family of (siblings)?"]} siblings. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} enjoys ${o["What is your hobby or favorite activity?"]} in ${a.possessive} free time and ${a.subject} is interested in ${o["What are your interests in your career?"]}.\n            ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} belief or principle is ${o["What is your belief or principle based on?"]}. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is inspired by ${o["What is your source of inspiration?"]} and aims to ${o["What is your contribution or goal?"]}. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is known for ${a.possessive} significant achievement: ${o["What is your significant achievement?"]}. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} best friend is ${l}. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} also values top 3 friends: ${i.join(", ")}.\n            ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite movie is ${o["What is your favorite movie?"]}. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite food is ${o["What is your favorite food?"]}. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} dream vacation destination is ${o["What is your dream vacation destination?"]}. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite sport is ${o["What is your favorite sport?"]}.\n        `,u,f);const d=document.getElementById("bottom-pedia-post"),m=s instanceof Date?s.toLocaleDateString("en-US",{month:"long"}):s;d.innerHTML=`\n            <p>${h}(born <span  data-value="${o["What is your country of birth?"]}" class="emphasized-word" data-value="${o["What is your country of birth?"]}">${o["What is your country of birth?"]}</span>, <span  data-value="${m}" class="emphasized-word">${s instanceof Date?s.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):s}</span>) is better known as <span >${o["Do you have any other names or aliases?"]}</span>. Currently marital status: <span >${o["What is your marital status"]}</span>.</p>\n            <p>${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is a <span  data-value="${o["What is your profession?"]}" class="emphasized-word" data-value="${o["What is your profession?"]}">${o["What is your profession?"]}</span>. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is <span >${(new Date).getFullYear()-r}</span> years old. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite color is <span  data-value="${o["What is your favorite color?"]}" class="emphasized-word">${o["What is your favorite color?"]}</span>, and ${a.subject} loves reading <span  data-value="${o["What is your favorite book?"]}" class="emphasized-word">${o["What is your favorite book?"]}</span>. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} profession is <span  data-value="${o["What is your profession?"]}" class="emphasized-word">${o["What is your profession?"]}</span>, and ${a.subject} raised with <span >${o["Raised in a family of (siblings)?"]}</span> siblings. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} enjoys <span  data-value="${o["What is your hobby or favorite activity?"]}" class="emphasized-word">${o["What is your hobby or favorite activity?"]}</span> in ${a.possessive} free time and ${a.subject} is interested in <span >${o["What are your interests in your career?"]}</span>.</p>\n            <p>${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} belief or principle is <span  class="emphasized-word" data-value="${o["What is your belief or principle based on?"]}">${o["What is your belief or principle based on?"]}</span>. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is inspired by <span >${o["What is your source of inspiration?"]}</span> and aims to <span >${o["What is your contribution or goal?"]}</span>. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} is known for ${a.possessive} significant achievement: <span >${o["What is your significant achievement?"]}</span>. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} best friend is <span  data-value="${l}" class="emphasized-word">${l}</span>. ${a.subject.charAt(0).toUpperCase()+a.subject.slice(1)} also values top 3 friends: <span style="color: maroon;" class="emphasized-word">${i.map((e=>`<span data-value="${e}" class="emphasized-word">${e}</span>`)).join(", ")}</span>.</p>\n            <p>${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite movie is <span  data-value="${o["What is your favorite movie?"]}" class="emphasized-word">${o["What is your favorite movie?"]}</span>. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite food is <span  data-value="${o["What is your favorite food?"]}" class="emphasized-word">${o["What is your favorite food?"]}</span>. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} dream vacation destination is <span  data-value="${o["What is your dream vacation destination?"]}" class="emphasized-word">${o["What is your dream vacation destination?"]}</span>. ${a.possessive.charAt(0).toUpperCase()+a.possessive.slice(1)} favorite sport is <span  data-value="${o["What is your favorite sport?"]}" class="emphasized-word">${o["What is your favorite sport?"]}</span>.</p>\n        `,o={},n=0,g(),document.querySelectorAll(".emphasized-word").forEach((e=>{e.addEventListener("mouseenter",b),e.addEventListener("mouseleave",x)})),d.querySelectorAll(".emphasized-word").forEach((e=>{e.addEventListener("dblclick",(()=>{!function(e){const n=e.previousSibling.textContent.trim().slice(0,-1);let o;const i=t.find((e=>e.question===n));i?"number"===i.type?(o=document.createElement("input"),o.type="number",o.placeholder=i.placeholder):"select"===i.type?(o=document.createElement("select"),i.options.forEach((t=>{const n=document.createElement("option");n.value=t,n.textContent=t,t===e.textContent&&(n.selected=!0),o.appendChild(n)}))):"date"===i.type?(o=document.createElement("input"),o.type="date"):(o=document.createElement("input"),o.type="text",o.placeholder=i.placeholder):(o=document.createElement("input"),o.type="text"),o.value=e.textContent,o.addEventListener("blur",(()=>w(o,e))),o.addEventListener("keydown",(t=>{"Enter"===t.key&&w(o,e)})),e.replaceWith(o),o.focus()}(e)}))}))}function b(e){const t=e.target,n=document.getElementById("search-div");n.style.display="block",n.style.left=`${e.pageX}px`,n.style.top=`${e.pageY+20}px`,n.innerHTML=`Searching for: ${t.getAttribute("data-value")}`,function(e,t){const n=JSON.parse(localStorage.getItem("friends")).find((t=>t.name.toLowerCase()===e.toLowerCase()));if(n){const e=`<img src="${n.image}" style="max-width: 200px; max-height: 100px;"><br> <p> ${n.description}</p>`;t(e)}else{const n=`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(e)}&format=json&origin=*`;fetch(n).then((e=>e.json())).then((n=>{if(n.query&&n.query.search&&n.query.search.length>0){const o=n.query.search.map((e=>`<div><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(e.title)}" target="_blank">${e.title}</a><p>${e.snippet}</p></div>`)).join("<br>");t(`found: ${e}<br>${o}`)}else{t(`\n                            <p> No results found for: ${e}(double click to edit)</p> <br> <img src="magic5.png" alt="default-image">`)}})).catch((n=>{console.error("Error fetching data from Wikipedia:",n);t(`\n                            <p> No data found for: ${e}(check your connection)</p> <br> <img src="magic5.png" alt="default-image">`)}))}}(t.getAttribute("data-value"),(e=>{n.innerHTML=`Looking for: ${t.getAttribute("data-value")}<br>${e}`}))}function x(){document.getElementById("search-div").style.display="none"}p.textContent=h,y.src=JSON.parse(localStorage.getItem("myself"))?.image||"magic5.png",g(),d.addEventListener("click",v),l.addEventListener("click",(function(){if(n>0){n--,g();document.getElementById("answer").select()}})),c.addEventListener("click",(function(){n<t.length-1&&(n++,g())})),r.addEventListener("click",(function(){E(),v()})),m.addEventListener("click",(function(){E(),L()})),document.getElementById("answer-input").addEventListener("keypress",(function(e){"Enter"!==e.key||r.disabled||(e.preventDefault(),E(),v())}))}));
