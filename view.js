
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
            confirmOverlayDiv.classList.add('confirm-overlayed');

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


    document.addEventListener("keypress", (event) => {
        if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
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
        if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
            if (event.key === "Backspace" || event.key === "Delete") {
                searchQuery = searchQuery.slice(0, -1);
                characterDisplay.textContent = searchQuery;

                console.log(searchQuery);
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
        const myselfImage = JSON.parse(localStorage.getItem('myself'));
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
                            <p> No results found for: ${query}(click to edit)</p> <br> <img src="magic5.png" alt="default-image">`;
                        callback(noResultHtml);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data from Wikipedia:', error);
                    callback('Error fetching data from Wikipedia.');
                });
        }
    }
    
});



//====================================================================================================================================


//===================================================================================================================================
