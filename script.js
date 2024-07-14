document.addEventListener("DOMContentLoaded", () => {
    // Continue displaying the loading page for an additional 10 seconds after the DOM is loaded
    setTimeout(() => {
        document.getElementById("magicload").style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow scrolling after loading is complete
    }, 2000); // 25 seconds in total
});




document.addEventListener('DOMContentLoaded', () => {
    const tooltips = document.querySelectorAll('nav ul li a[data-tooltip]');
    tooltips.forEach(tooltip => {
      tooltip.addEventListener('mouseover', () => {
        tooltip.classList.add('show-tooltip');
      });
      tooltip.addEventListener('mouseout', () => {
        tooltip.classList.remove('show-tooltip');
      });
    });
  });



  document.getElementById('menu').addEventListener('click', function() {
    document.querySelector('.floating-nav').classList.toggle('show-menu');
});


  document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.section');
  
    links.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
  
        // Store the active section ID in local storage
        localStorage.setItem('activeSection', targetId);
        window.location.reload();
  
        // Update active link
        links.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
  
        // Show the target section and hide others
        sections.forEach(section => {
          if (section.id === targetId) {
            section.classList.add('active');
          } else {
            section.classList.remove('active');
          }
        });
      });
    });
  
    // Get the active section ID from local storage or default to 'home'
    const activeSectionId = localStorage.getItem('activeSection') || 'home';
  
    // Show the active section and set the active link
    sections.forEach(section => {
      if (section.id === activeSectionId) {
        section.classList.add('active');
        
      } else {
        section.classList.remove('active');
      }
    });
  
    // Update active link
    links.forEach(link => {
      if (link.getAttribute('href').substring(1) === activeSectionId) {
        link.classList.add('active');
        
      } else {
        link.classList.remove('active');
      }
    });
  });
  
  

document.addEventListener('DOMContentLoaded', () => {
    const ownerForm = document.getElementById('owner-form');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    const ownerDetailsList = document.getElementById('owner-details');
    const profileSection = document.getElementById('Profile');
    const onerformContainer = document.querySelector('.owner-form-container');
  
    // Check if user is in local storage
    const storedUser = localStorage.getItem('myself');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      displayUser(user);
      displayUserInHeader(user);
      displayUserProfile(user);
    } else {
      profileSection.innerHTML = '<h2>No Profile Yet</h2>';
    }
  
    ownerForm.addEventListener('submit', e => {
      e.preventDefault();
  
      const facebookName = document.getElementById('facebook-name').value;
      const bio = document.getElementById('bio').value;
      const imageFile = imageInput.files[0];
  
      // Check if image file is selected
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
          const user = {
            facebookName,
            bio,
            image: reader.result
          };
          localStorage.setItem('myself', JSON.stringify(user));
          displayUser(user);
          displayUserInHeader(user);
          displayUserProfile(user);
          window.location.reload();
        };
      }
    });
  
    // Function to display user details in main content area
    function displayUser(user) {
        ownerForm.style.display = 'none'; // Hide form
        onerformContainer.style.display = 'none';
        const profileLink = document.querySelector('nav ul li a[href="#Profile"]');
        const profileImage = document.querySelector('nav ul li a[href="#Profile"] img');
        
        
        profileLink.innerHTML = `<img src="${user.image}" alt="${user.facebookName}">`;
        profileImage.src = user.image;
        ownerDetailsList.innerHTML = `<li><a href="#Profile" data-tooltip="Me"><img src="${user.image}" alt="${user.facebookName}"></a></li>`;
    }

    
    // Function to display user details in header
    function displayUserInHeader(user) {
      const profileLink = document.querySelector('nav ul li a[href="#Profile"]');
      profileLink.innerHTML = `<img src="${user.image}" alt="${user.facebookName}">`;
    }
  
    // Function to display user details in profile section
    function displayUserProfile(user) {
        profileSection.innerHTML = `
        <button id="edit-profile">Edit Profile</button>
        <h2>${user.facebookName}</h2>
        <img src="${user.image}" alt="${user.facebookName}">
        <p>${user.bio}</p>
        <button id="log-out">Log Out</button>
        `;
        const editProfileButton = document.getElementById('edit-profile');
        editProfileButton.addEventListener('click', () => {
        displayEditProfileForm(user); // Display edit profile form on button click
        });

        const logOutButton = document.getElementById('log-out');

        logOutButton.addEventListener('click', function() {
            localStorage.clear();
            alert('You have been logged out.');
            
        });
    }
    
    // Function to display the edit profile form
    function displayEditProfileForm(user) {
        profileSection.innerHTML = `
        <div class="owner-form-container">
            <h3>Edit Profile</h3>
            <form id="edit-profile-form">
            <div class="form-group">
                <label for="edit-facebook-name">Facebook Name</label>
                <input type="text" id="edit-facebook-name" name="edit-facebook-name" value="${user.facebookName}" required>
            </div>
            <div class="form-group">
                <label for="edit-image">Profile Picture</label>
                <input type="file" id="edit-image" name="edit-image" accept="image/*">
                <div class="image-overview" id="edit-image-preview"></div>
            </div>
            <div class="form-group">
                <label for="edit-bio">Bio</label>
                <textarea id="edit-bio" name="edit-bio" rows="4" required>${user.bio}</textarea>
            </div>
            <div class="button-group">
                <button type="button" id="cancel-edit">Cancel</button>
                <button type="submit" id="save-edit">Save</button>
            </div>
            </form>
        </div>
        `;
        
        // Event listener for cancel button
        const cancelEditButton = document.getElementById('cancel-edit');
        cancelEditButton.addEventListener('click', () => {
        displayUserProfile(user); // Display user profile again on cancel
        });

        // Image preview functionality for the edit profile form
        const editImageInput = document.getElementById('edit-image');
        const editImagePreview = document.getElementById('edit-image-preview');
        editImageInput.addEventListener('change', () => {
            const file = editImageInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    editImagePreview.innerHTML = `<img src="${reader.result}" alt="Image Preview">`;
                };
                reader.readAsDataURL(file);
                
            }
        });

        // Event listener for form submission
        const editProfileForm = document.getElementById('edit-profile-form');
        editProfileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveEditedProfile(user); // Save edited profile on form submission
        window.location.reload();
        });
    }

    
    // Function to save edited profile details
    function saveEditedProfile(user) {
        const editedFacebookName = document.getElementById('edit-facebook-name').value;
        const editedBio = document.getElementById('edit-bio').value;
        const editedImage = document.getElementById('edit-image').files[0]; // Get the selected file
        
        // Check if a new image file is selected
        if (editedImage) {
            // Read the contents of the selected image file
            const reader = new FileReader();
            reader.readAsDataURL(editedImage);
            reader.onload = () => {
                const editedUser = {
                    facebookName: editedFacebookName,
                    image: reader.result, // Use the base64 data URL of the image
                    bio: editedBio
                };

                // Update user details in localStorage
                localStorage.setItem('myself', JSON.stringify(editedUser));

                // Display the updated user profile
                displayUser(editedUser); // Update the user profile in the UI
                displayUserProfile(editedUser);
            };
        } else {
            // If no new image file is selected, update other details without changing the image
            const editedUser = {
                facebookName: editedFacebookName,
                image: user.image, // Retain the original image
                bio: editedBio
            };

            // Update user details in localStorage
            localStorage.setItem('myself', JSON.stringify(editedUser));

            // Display the updated user profile
            displayUser(editedUser); // Update the user profile in the UI
            displayUserProfile(editedUser);
        }
    }


    // Image preview functionality
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.innerHTML = `<img src="${reader.result}" alt="Image Preview">`;
        };
        reader.readAsDataURL(file);
      }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const newQuoteBtn = document.getElementById('new-quote-btn');

    // Fetch a random quote from an API
    function fetchRandomQuote() {
        newQuoteBtn.disabled = true; // Disable button
        fetch('https://api.quotable.io/random')
            .then(response => response.json())
            .then(data => {
                typeText(data.content);
            })
            .catch(error => {
                console.error('Error fetching quote:', error);
                newQuoteBtn.disabled = true; // Enable button in case of error
            });
    }

    // Function to create typing effect
    function typeText(text) {
        const quoteText = document.getElementById('quote-text');
        quoteText.textContent = '';
        let index = 0;
        const speed = 50; // Typing speed in milliseconds

        function typeCharacter() {
            if (index < text.length) {
                quoteText.textContent += text.charAt(index);
                index++;
                setTimeout(typeCharacter, speed);
            } else {
                newQuoteBtn.disabled = false; // Enable button after typing finishes
            }
        }

        typeCharacter();
    }

    // Display a random quote when the page loads
    fetchRandomQuote();

    // Event listener for the "New Quote" button
    newQuoteBtn.addEventListener('click', fetchRandomQuote);
});


//===================================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.tic-tac-toe .cell');
    const user = JSON.parse(localStorage.getItem('myself'));
    const playerName = user ? user.facebookName : 'Player';
    
    let currentPlayer = playerName;
    let board = ['', '', '', '', '', '', '', '', ''];
    let playerWins = 0; // Track player's win count
    let computerWins = 0; // Track computer's win count
    let useLogo1 = true;

    // Function to get the player image from local storage
    const getPlayerImage = () => {
        return user ? user.image : null;
    };

    // Function to show notification
    const showNotification = (message) => {
        const notification = document.querySelector('.notificationed');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    };

    // Function to handle cell click
    const handleCellClick = (index) => {
        if (board[index] === '' && currentPlayer === playerName) {
            board[index] = 'O';
            render();
            if (checkWin('O')) {
                playerWins++;
                showNotification(`${currentPlayer} wins!`);
                setTimeout(() => {
                    resetGame();
                }, 2000);
            } else if (!board.includes('')) {
                showNotification('It\'s a draw!');
                setTimeout(() => {
                    resetGame();
                }, 2000);
            } else {
                currentPlayer = 'X';
                setTimeout(computerMove, 500);
            }
        }
    };

    // Function to render the game board
    const render = () => {
        const playerImage = getPlayerImage();
        const computerImage = useLogo1 ? 'logo.png' : 'magic5.png';;
        board.forEach((value, index) => {
            const cell = cells[index];
            cell.className = `cell ${value.toLowerCase()}`;
            if (value === 'O') {
                if (playerImage) {
                    cell.style.backgroundImage = `url(${playerImage})`;
                    cell.style.backgroundSize = 'cover';
                    cell.style.backgroundPosition = 'center';
                    cell.textContent = '';
                } else {
                    cell.style.backgroundImage = '';
                    cell.textContent = 'O';
                }
            } else if (value === 'X') {
                cell.style.backgroundImage = `url(${computerImage})`; // Make sure the URL is correct and the image exists
                cell.textContent = '';
            } else {
                cell.style.backgroundImage = '';
                cell.textContent = '';
            }
        });

        updateScore(); // Update score after each render
    };

    const updateScore = () => {
        const resultElement = document.querySelector('.score .result');
        resultElement.textContent = `Player: ${playerWins} - Computer: ${computerWins}`;
    };

    // Function to handle reset button click
    const handleResetButtonClick = () => {
        playerWins = 0; // Reset player's win count
        computerWins = 0; // Reset computer's win count
        updateScore(); // Update score display
        resetGame(); // Reset the game
    };

    // Add click event listener to reset button
    const resetButton = document.querySelector('.score button');
    resetButton.addEventListener('click', handleResetButtonClick);

    
    // Minimax algorithm for unbeatable AI
    const minimax = (newBoard, player) => {
        const availSpots = newBoard.map((s, i) => (s === '' ? i : null)).filter(i => i !== null);

        const winning = (board, player) => {
            const winningCombos = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6]             // Diagonals
            ];
            for (const combo of winningCombos) {
                const [a, b, c] = combo;
                if (board[a] === player && board[a] === board[b] && board[a] === board[c]) {
                    return true;
                }
            }
            return false;
        };

        if (winning(newBoard, 'O')) {
            return { score: -10 };
        } else if (winning(newBoard, 'X')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'X') {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = '';

            moves.push(move);
        }

        let bestMove;
        if (player === 'X') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    };

    // Function for computer to make a move
    const computerMove = () => {
        const bestSpot = minimax(board, 'X');
        board[bestSpot.index] = 'X';
        render();
        if (checkWin('X')) {
            computerWins++;
            showNotification('Computer (X) wins!');
            setTimeout(() => {
                resetGame();
            }, 2000);
        } else if (!board.includes('')) {
            showNotification('It\'s a draw!');
            setTimeout(() => {
                resetGame();
            }, 2000);
        } else {
            currentPlayer = playerName;
        }
    };

    // Function to check for a win
    const checkWin = (player) => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] === player && board[a] === board[b] && board[a] === board[c]) {
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                
                return true;
            }
        }
        return false;
    };

    // Function to reset the game
    const resetGame = () => {
        currentPlayer = playerName;
        board = ['', '', '', '', '', '', '', '', ''];
        render();
        cells.forEach(cell => {
            cell.classList.remove('win');
            cell.textContent = ''; // Clearing the content of each cell
            render();
        });
    };


    // Add click event listeners to cells
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    // Initial render
    render();


    // Function to render the player's image
    const renderPlayerImage = () => {
        const playerImageElement = document.getElementById('player-img');
        const playerImage = getPlayerImage();
        if (playerImage) {
            playerImageElement.src = playerImage;
        } else {
            playerImageElement.src = ''; // Set to a default image if player image is not available
        }
    };

    // Call the renderPlayerImage function in the initial render
    renderPlayerImage();
});



//===============================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const friendForm = document.getElementById('friend-form');
    const friendNameInput = document.getElementById('friend-name');
    const friendImageInput = document.getElementById('friend-image');
    const friendEmotionInput = document.getElementById('friend-emotion');
    const friendDescriptionInput = document.getElementById('friend-description');
    const addFriendButton = document.getElementById('add-friend-button');
    const imagePreview = document.getElementById('image-previews');
    const friendsList = document.getElementById('friends-list');
    const friendsCount = document.getElementById('count');
    const magicViewLink = document.getElementById('magic-view');

    let friendIndex = 0;
    let friendsData = [];

    // Enable add friend button if all inputs are filled
    function checkFormValidity() {
        addFriendButton.disabled = !(
            friendNameInput.value.trim() &&
            friendImageInput.files.length &&
            friendEmotionInput.value !== "none" &&
            friendDescriptionInput.value.trim()
        );
    }

    friendForm.addEventListener('input', checkFormValidity);

    // Display image preview
    friendImageInput.addEventListener('change', () => {
        const file = friendImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                imagePreview.innerHTML = `<img src="${reader.result}" alt="Image Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
        checkFormValidity();
    });

    // Update friends count
    function updateFriendsCount() {
        const count = friendsList.children.length;
        friendsCount.textContent = count;

         // Disable magic view link and show notification if count is less than 5
         if (count < 5) {
            magicViewLink.classList.add('disabled'); // Add disabled class to disable link
            magicViewLink.textContent = 'Create more friends to go to magic world'; // Change link text
        } else {
            magicViewLink.classList.remove('disabled'); // Remove disabled class to enable link
            magicViewLink.textContent = 'Go to magic view'; // Restore original link text
        }
    }

    // Load friends from local storage
    function loadFriendsFromStorage() {
        const storedFriends = localStorage.getItem('friends');
        if (storedFriends) {
            friendsData = JSON.parse(storedFriends);
            friendIndex = friendsData.length; // Set friend index to the length of loaded data
            renderFriends();
        }
    }

    // Save friends to local storage
    function saveFriendsToStorage() {
        localStorage.setItem('friends', JSON.stringify(friendsData));
    }

    // Render friends list
    function renderFriends() {
        friendsList.innerHTML = ''; // Clear existing list
        friendsData.forEach((friend, index) => {
            const { name, image, emotion, description } = friend;
            const friendItem = document.createElement('li');
            friendItem.classList.add('friend-item');
            friendItem.innerHTML = `
                <div class="friend-number">#${index + 1}</div>
                <img src="${image}" alt="${name}">
                <div class="friend-details">
                    <h4>${name}</h4>
                    <p><strong>Emotion:</strong> <b> ${emotion}</b></p>
                    <p><b>${description}<b></p>
                </div>
                <div class="friend-actions">
                    <i class="fas fa-edit" onclick="editFriend(${index})"></i>
                    <i class="fas fa-trash" onclick="deleteFriend(${index})"></i>
                </div>
            `;
            friendsList.appendChild(friendItem);
        });
        updateFriendsCount();
    }

    // Handle form submission
    friendForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = friendNameInput.value.trim();
        const image = friendImageInput.files[0];
        const emotion = friendEmotionInput.value;
        const description = friendDescriptionInput.value.trim();

        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result;

            // Add new friend to data array
            friendsData.push({ name, image: imageUrl, emotion, description });

            // Save friends to local storage
            saveFriendsToStorage();

            // Render friends list
            renderFriends();

            // Clear the form
            friendForm.reset();
            imagePreview.innerHTML = '';
            addFriendButton.disabled = true;
        };
        reader.readAsDataURL(image);
    });

    // Edit friend
    window.editFriend = function(index) {
        const friend = friendsData[index];
        const editFormContainer = document.createElement('div');
        editFormContainer.classList.add('edit-form-container');

        const editForm = document.createElement('form');
        editForm.classList.add('edit-form');
        editForm.innerHTML = `
            <h3>Edit Friend</h3>
            <div class="form-group">
                <label for="edit-name">Name:</label>
                <input type="text" id="edit-name" name="edit-name" value="${friend.name}" required>
            </div>
            <div class="form-group">
                <label for="edit-image">Image:</label>
                <input type="file" id="edit-image" name="edit-image" accept="image/*">
                <div id="edit-image-preview"><img src="${friend.image}" alt="Image Preview"></div>
            </div>
            <div class="form-group">
                <label for="edit-emotion">Emotion:</label>
                <select id="edit-emotion" name="edit-emotion" required>
                   <option value="none" disabled selected>How do you feel about your friend</option>
                    <option value="joyful">😊 Joyful</option>
                    <option value="grateful">🙏 Grateful</option>
                    <option value="excited">😃 Excited</option>
                    <option value="inspired">🌟 Inspired</option>
                    <option value="supported">🤗 Supportive</option>
                    <option value="amused">😄 Amused</option>
                    <option value="comforted">💖 Comforted</option>
                    <option value="appreciative">👏 Appreciative</option>
                    <option value="lovely">😍 Lovely</option>
                    <option value="cherished">💝 Cherished</option>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-description">Description:</label>
                <textarea id="edit-description" name="edit-description" required>${friend.description}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" id="edit-close">Cancel</button>
                <button type="submit">Done</button>
            </div>
        `;

        editFormContainer.appendChild(editForm);
        friendsList.replaceChild(editFormContainer, friendsList.children[index]);

        // Update image preview when an image is selected
        const editImageInput = editForm.querySelector('#edit-image');
        const editImagePreview = editForm.querySelector('#edit-image-preview img');
        editImageInput.addEventListener('change', () => {
            const file = editImageInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    editImagePreview.src = reader.result;
                };
                reader.readAsDataURL(file);
            } else {
                editImagePreview.src = friend.image;
            }

            window.location.reload();
        });

        editForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Update friend's details
            friend.name = editForm.querySelector('#edit-name').value.trim();
            friend.emotion = editForm.querySelector('#edit-emotion').value;
            friend.description = editForm.querySelector('#edit-description').value.trim();

            // Update friend's image if a new image is selected
            if (editImageInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = () => {
                    friend.image = reader.result;

                    // Save friends to local storage
                    saveFriendsToStorage();

                    // Render friends list
                    renderFriends();
                };
                reader.readAsDataURL(editImageInput.files[0]);
            } else {
                // Save friends to local storage
                saveFriendsToStorage();

                // Render friends list
                renderFriends();
            }

            window.location.reload();
        });

        const editCloseBtn = document.getElementById('edit-close');
        editCloseBtn.onclick = () => {
            cancelEdit();
        };
    };



    // Delete friend
    window.deleteFriend = function(index) {
        // Create confirmation overlay
        const confirmationOverlay = document.createElement('div');
        confirmationOverlay.classList.add('confirmation-overlay');
        confirmationOverlay.innerHTML = `
            <div class="confirmation-box">
                <p>Are you sure you want to delete this friend?</p>
                <div class="confirmation-buttons">
                    <button class="confirm-button">Yes</button>
                    <button class="cancel-button">No</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmationOverlay);


        function reindexFriends() {
            const friendItems = friendsList.querySelectorAll('.friend-item');
            friendItems.forEach((friendItem, index) => {
                const friendNumber = friendItem.querySelector('.friend-number');
                friendNumber.textContent = `#${index + 1}`;
            });
        }
        
        // Add event listeners for confirmation buttons
        const confirmButton = confirmationOverlay.querySelector('.confirm-button');
        const cancelButton = confirmationOverlay.querySelector('.cancel-button');
        confirmButton.addEventListener('click', () => {
            // Remove friend from data array
            friendsData.splice(index, 1);

            // Re-index friends
            reindexFriends();

            // Save friends to local storage
            saveFriendsToStorage();

            // Remove confirmation overlay
            confirmationOverlay.remove();

            // Render friends list
            renderFriends();
        });
        cancelButton.addEventListener('click', () => {
            // Remove confirmation overlay
            confirmationOverlay.remove();
        });

        window.location.reload();
    };


    // Load friends from local storage on page load
    loadFriendsFromStorage();
});

//============================================================================================================================

const selectedFriends = []; // Store selected friends

// Retrieve friend list from local storage
function getFriendsFromLocalStorage() {
    const friends = localStorage.getItem('friends');
    return friends ? JSON.parse(friends) : [];
}

// Display the friend list as clickable ingredients
function displayFriends() {
    const friendListElement = document.getElementById('friend-listing');
    friendListElement.innerHTML = ''; // Clear existing items

    const friends = getFriendsFromLocalStorage();
    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('ingredient');
        friendElement.innerText = friend.name; // Display friend name
        friendElement.onclick = () => selectIngredient(friend.name, friendElement);
        friendListElement.appendChild(friendElement);
    });
}

// Function to select an ingredient (friend)
function selectIngredient(friend, friendElement) {
    if (selectedFriends.length < 2 || selectedFriends.includes(friend)) {
        // Check if already selected to disable further clicks
        if (!selectedFriends.includes(friend)) {
            selectedFriends.push(friend);
            friendElement.classList.add('selected');
        } else {
            // Remove the friend from the selected list if clicked again
            selectedFriends.splice(selectedFriends.indexOf(friend), 1);
            friendElement.classList.remove('selected');
        }

        // Re-enable clicking if less than two friends are selected
        if (selectedFriends.length < 2) {
            document.querySelectorAll('.ingredient.disabled').forEach(item => {
                item.onclick = () => selectIngredient(item.innerText, item);
                item.classList.remove('disabled');
            });
        }

        // Disable clicking additional friends after two selections
        if (selectedFriends.length === 2) {
            document.querySelectorAll('.ingredient').forEach(item => {
                if (!selectedFriends.includes(item.innerText)) {
                    item.onclick = null;
                    item.classList.add('disabled');
                }
            });
        }
    }
}

// Update potion display area
function updatePotionDisplay() {
    document.getElementById("potion").innerText = "Your potion will appear here!";
    document.getElementById("message").innerText = "";
}

// Brew the potion based on selected friends
function brewPotion() {
    if (selectedFriends.length < 2) {
        document.getElementById("message").innerText = "Please select at least two friends!";
        return;
    }

    // Generate baby name based on selected friends
    const babyName = generateBabyName(selectedFriends[0], selectedFriends[1]);
    document.getElementById("potion").innerHTML = `👶 Baby name: ${babyName}`;
    document.getElementById("message").innerText = "Potion successfully brewed!";
}

// Generate a baby name based on selected friends
function generateBabyName(friend1, friend2) {
    const firstNamePart = friend1.split(' ')[0].substring(0, 3); // First 3 letters of the first friend's first name
    const lastNamePart = friend2.split(' ')[1] ? friend2.split(' ')[1].substring(0, 3) : friend2.substring(0, 3); // First 3 letters of the second friend's last name or first name if no last name
    const combinedName = `${firstNamePart}${lastNamePart}`.toLowerCase();
    const babyName = combinedName.charAt(0).toUpperCase() + combinedName.slice(1);
    return babyName;
}

// Reset the game state
function resetGame() {
    selectedFriends.length = 0;
    displayFriends();
    updatePotionDisplay();
}

// Initial display of friends from local storage
displayFriends();




// Fancy Quiz Game Variables and Functions
const quizGameSelectedFriends = []; // Store selected friends for the Quiz Game
const questions = [
    "Who will have the cutest baby between?",
    "Who is most likely to be a superhero?",
    "Who would make the best chef?",
    "Who is the funniest?",
    "Who would survive a zombie apocalypse?",
    "Who is the most likely to become a millionaire?",
    "Who is the best storyteller?",
    "Who would make the best reality TV star?",
    "Who has the most adventurous spirit?",
    "Who is the best at giving advice?",
    "Who would make the best travel blogger?",
    "Who has the most contagious laugh?",
    "Who is the most likely to start a successful business?",
    "Who is the best dancer?",
    "Who has the best taste in music?",
    "Who would win in a karaoke competition?",
    "Who is the most likely to write a bestseller?",
    "Who would be the best at organizing a surprise party?",
    "Who is the most stylish?",
    "Who has the best cooking skills?",
    "Who would make the best movie director?",
    "Who is the most likely to run a marathon?",
    "Who has the most unique talent?",
    "Who would be the best at solving a mystery?",
    "Who is the most likely to volunteer for a good cause?"
];


// Retrieve friend list from local storage
function getFriendsFromLocalStorage() {
    const friends = localStorage.getItem('friends');
    return friends ? JSON.parse(friends) : [];
}

// Display the friend list as clickable ingredients for the Fancy Quiz
function displayQuizFriends() {
    const quizFriendListElement = document.getElementById('quiz-friend-listing');
    quizFriendListElement.innerHTML = ''; // Clear existing items

    const friends = getFriendsFromLocalStorage();
    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('ingredient');
        friendElement.innerText = friend.name; // Display friend name
        friendElement.onclick = () => selectQuizIngredient(friend.name, friendElement);
        quizFriendListElement.appendChild(friendElement);
    });
}

// Function to select an ingredient (friend) for the Fancy Quiz
function selectQuizIngredient(friend, friendElement) {
    if (quizGameSelectedFriends.length < 2 || quizGameSelectedFriends.includes(friend)) {
        // Check if already selected to disable further clicks
        if (!quizGameSelectedFriends.includes(friend)) {
            quizGameSelectedFriends.push(friend);
            friendElement.classList.add('selected');
        } else {
            // Remove the friend from the selected list if clicked again
            quizGameSelectedFriends.splice(quizGameSelectedFriends.indexOf(friend), 1);
            friendElement.classList.remove('selected');
        }

        // Re-enable clicking if less than two friends are selected
        if (quizGameSelectedFriends.length < 2) {
            document.querySelectorAll('.ingredient.disabled').forEach(item => {
                item.onclick = () => selectQuizIngredient(item.innerText, item);
                item.classList.remove('disabled');
            });
        }

        // Disable clicking additional friends after two selections
        if (quizGameSelectedFriends.length === 2) {
            document.querySelectorAll('.ingredient').forEach(item => {
                if (!quizGameSelectedFriends.includes(item.innerText)) {
                    item.onclick = null;
                    item.classList.add('disabled');
                }
            });
        }
    }
}

// Update quiz display area
function updateQuizDisplay() {
    document.getElementById("quiz-result").innerText = "Your answer will appear here!";
    document.getElementById("quiz-message").innerText = "";
}

// Display a random question for the Fancy Quiz
function nextQuestion() {
    const question = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById("quiz-question").innerText = question;
    updateQuizDisplay();
    resetQuiz();
}

// Brew the quiz result based on selected friends
function brewQuiz() {
    if (quizGameSelectedFriends.length < 2) {
        document.getElementById("quiz-message").innerText = "Please select at least two friends!";
        return;
    }

    const chosenFriend = quizGameSelectedFriends[Math.floor(Math.random() * quizGameSelectedFriends.length)];
    document.getElementById("quiz-result").innerHTML = `🎉 Winner: ${chosenFriend}`;
    document.getElementById("quiz-message").innerText = "Result generated!";
}

// Reset the game state for the Fancy Quiz
function resetQuiz() {
    quizGameSelectedFriends.length = 0;
    displayQuizFriends();
    updateQuizDisplay();
}

// Initial display of friends from local storage
displayQuizFriends();
nextQuestion();





document.addEventListener("DOMContentLoaded", () => {
    const wheel = document.getElementById("wheel");
    const centerImage = document.getElementById("centerImage");
    const spinButton = document.getElementById("spinButton");
    const resultImage = document.getElementById("resultImage");
    const questionText = document.getElementById("questions");
    const spinSound = document.getElementById("spinSound");

    // Load user image from local storage and display it
    const userImageKey = "myself";
    const userImageData = JSON.parse(localStorage.getItem(userImageKey)) || { image: "logo.png" };
    if (userImageData && userImageData.image) {
        centerImage.src = userImageData.image;
    }

    // Load friend images from local storage and create wheel segments
    const outcomesKey = "friends";
    const friendsData = JSON.parse(localStorage.getItem(outcomesKey)) || [];
    const outcomes = friendsData.map(friend => friend.image);
    const friendNames = friendsData.map(friend => friend.name); // Assuming friends data has names

    const numFriends = outcomes.length; // Number of friends
    let sliceAngle = 360 / numFriends; // Angle of each slice

    // If there are four or fewer friends, divide the entire circle by 360
    if (numFriends <= 4) {
        sliceAngle = 360 / numFriends;
    }

    // Display friends as segments in the wheel
    outcomes.forEach((image, index) => {
        const segment = document.createElement("div");
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        segment.classList.add("segment");
        segment.style.transform = `rotate(${index * sliceAngle}deg) skewY(-${90 - sliceAngle}deg)`;

        const img = document.createElement("img");
        img.src = image;
        img.alt = `Friend ${index + 1}`;

        imageContainer.appendChild(img);
        segment.appendChild(imageContainer);
        wheel.appendChild(segment);
    });

    // Random questions array
    const questions = [
        "Which friend is likely to miss you the most?",
        "Which friend loves you the most?",
        "Which friend hugs the most?",
        "Which friend has the best smile?",
        "Which friend would you call first in an emergency?",
        "Which friend makes you laugh the hardest?",
        "Which friend has the most interesting stories?",
        "Which friend is the most adventurous?",
        "Which friend is the best cook?",
        "Which friend is the most stylish?",
        "Which friend would you trust with your deepest secrets?",
        "Which friend is the most generous?",
        "Which friend has the best advice?",
        "Which friend is the most creative?",
        "Which friend is the most likely to become famous?",
        "Which friend would you want by your side on a deserted island?",
        "Which friend is the best dancer?",
        "Which friend has the best taste in music?",
        "Which friend is the most reliable?",
        "Which friend is the best at keeping surprises?",
        "Which friend would make the best travel companion?",
        "Which friend has the funniest jokes?",
        "Which friend is the most tech-savvy?",
        "Which friend would you want to be your partner in a game show?",
        "Which friend has the most contagious laugh?"
    ];

    // Function to simulate spinning the wheel
    function spinWheel() {
        spinButton.disabled = true; // Disable the spin button

        spinSound.currentTime = 0; // Reset the audio to the start
        spinSound.play(); // Play the spinning sound

        const randomIndex = Math.floor(Math.random() * numFriends);
        const randomDirection = Math.random() < 0.5 ? 1 : -1; // Randomly choose clockwise (1) or counterclockwise (-1)
        const degrees = (randomDirection * 3600) + (randomIndex * sliceAngle);

        wheel.style.transition = "transform 2s ease-out";
        wheel.style.transform = `rotate(${degrees}deg)`;

        // Reverse spin direction for the second half of the spin
        setTimeout(() => {
            const reverseDegrees = -degrees;
            wheel.style.transition = "transform 2s ease-out";
            wheel.style.transform = `rotate(${reverseDegrees}deg)`;
        }, 2000);

        // Stop the wheel and display the result after 4 seconds
        setTimeout(() => {
            spinSound.pause(); // Stop the spinning sound
            const resultFriendName = friendNames[randomIndex];
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            questionText.innerHTML = `${randomQuestion} <span>${resultFriendName}</span>`;
            resultImage.src = outcomes[randomIndex]; // Display the selected outcome image
        }, 4000);

        // Re-enable the spin button after 5 seconds
        setTimeout(() => {
            spinButton.disabled = false;
        }, 5000);
    }

    // Add event listener to spin button
    spinButton.addEventListener("click", spinWheel);
});

//===========================================================================================================================


document.addEventListener("DOMContentLoaded", () => {
    const fileUpload = document.getElementById("fileUpload");
    const userImageElement = document.getElementById("userImage");
    const songList = document.getElementById("songList");
    const friendImage = document.getElementById("friendImage");
    const songTitle = document.getElementById("songTitle");
    const audioPlayer = document.getElementById("audioPlayer");
    const audioSpectrum = document.getElementById("audioSpectrum");
    const musicSymbolsContainer = document.getElementById("musicSymbolsContainer");

    // Retrieve user image URL from local storage
    const userData = JSON.parse(localStorage.getItem("myself")); // Assuming user data is stored as an object
    const userImageUrl = userData ? userData.image : "logo.png";
    if (userImageUrl) {
        userImageElement.src = userImageUrl;
    }

    // Retrieve friend images from local storage as an array of image URLs
    const friendsImagesData = JSON.parse(localStorage.getItem("friends")) || []; // Assuming friends array contains objects
    const friendsImages = friendsImagesData.map(friend => friend.image); // Extract image URLs

    const songs = JSON.parse(sessionStorage.getItem("songs")) || [];

    // Function to create a list item for each song
    function createSongItem(name, src) {
        const li = document.createElement("li");
        li.textContent = name;
        li.addEventListener("click", () => {
            playSong(name, src);
        });
        songList.appendChild(li);
    }

    // Function to play a selected song
    // Function to play a selected song
    function playSong(name, src) {
        songTitle.textContent = name;
        audioPlayer.src = src;

        // Attempt to load and play the song
        audioPlayer.load(); // Reload the audio element with the new source
        audioPlayer.play()
        
            .then(() => {
                // Playback started successfully
                const randomImage = friendsImages[Math.floor(Math.random() * friendsImages.length)];
                friendImage.src = randomImage;

                showNotifications('Music Playing...', "info")
            })
            .catch(error => {
                // Error occurred while playing the song
                console.error('Error playing song:', error);
                // Remove the song from the list
                const listItems = songList.getElementsByTagName('li');
                Array.from(listItems).forEach(item => {
                    if (item.textContent === name) {
                        item.remove(); // Remove from UI
                        // Optionally remove from internal array 'songs'
                        const index = songs.findIndex(song => song.name === name);
                        if (index !== -1) {
                            songs.splice(index, 1);
                        }
                    }
                });

                // Show notification to the user
            showNotifications(`Failed to play '${name}'. Song data was lost.`, 'error');
            });
    }

    function showNotifications(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
    
        // Clear the notification after a few seconds
        setTimeout(() => {
            notification.textContent = '';
            notification.className = 'notification';
        }, 10000); // Adjust duration as needed (e.g., 3000ms = 3 seconds)
    }
    


    // Handle file uploads
    fileUpload.addEventListener("change", (event) => {
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target.result;
                createSongItem(file.name, url);
                songs.push({ name: file.name, url: url });
                sessionStorage.setItem("songs", JSON.stringify(songs)); // Save songs to session storage
            };
            reader.readAsDataURL(file);
        }
    });

    // Load songs from session storage and create list items
    songs.forEach(song => {
        createSongItem(song.name, song.url);
    });

    // Function to create multiple raining music symbols
    function createRainingMusicSymbols() {
        const numSymbols = 30; // Number of symbols to create

        for (let i = 0; i < numSymbols; i++) {
            const musicSymbol = document.createElement("div");
            musicSymbol.textContent = "♪"; // Music symbol (or use an icon)
            musicSymbol.classList.add("music-symbol");

            // Random position within viewport
            const randomX = Math.random() * window.innerWidth;
            const randomDelay = Math.random() * 5; // Random delay for each symbol
            musicSymbol.style.left = `${randomX - 10}px`;
            musicSymbol.style.animationDelay = `${randomDelay}s`;

            musicSymbolsContainer.appendChild(musicSymbol);

            // Remove music symbol after animation ends
            musicSymbol.addEventListener("animationend", () => {
                musicSymbol.remove();
            });
        }
    }

    // Function to clear all raining music symbols
    function clearRainingMusicSymbols() {
        while (musicSymbolsContainer.firstChild) {
            musicSymbolsContainer.removeChild(musicSymbolsContainer.firstChild);
        }
    }

     // Add event listener to audio player to trigger raining music symbols when song is playing
     audioPlayer.addEventListener("playing", () => {
        createRainingMusicSymbols();
    });

     // Add event listener to audio player to clear raining music symbols when song is paused
     audioPlayer.addEventListener("pause", () => {
        clearRainingMusicSymbols();
    });

    audioPlayer.addEventListener("ended", () => {
        clearRainingMusicSymbols();
    });

    // Audio Visualization
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const canvas = document.createElement("canvas");
    audioSpectrum.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = audioSpectrum.clientWidth;
        canvas.height = audioSpectrum.clientHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function draw() {
        requestAnimationFrame(draw);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
    
        for (let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i] / 2;
            // Generate random colors
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    
    draw();
});

//=========================================================================================================================



document.addEventListener("DOMContentLoaded", () => {
    const scrollNotification = document.getElementById("scroll-notification");
    const friendsImagesData = JSON.parse(localStorage.getItem("friends")) || [];
    const scoreboard = document.querySelector('.scoreboard');
    const homeSection = document.getElementById("home");

    // Function to handle scroll behavior
    function handleScroll() {
        if (window.scrollY > scoreboard.offsetTop) {
            window.scrollTo(0, scoreboard.offsetTop);
            scrollNotification.classList.add('visible');
            setTimeout(() => {
                scrollNotification.classList.remove('visible');
            }, 6000); // Hide notification after 6 seconds
        }
    }

    // Function to check if user is on the home page
    function isOnHomePage() {
        return homeSection && homeSection.classList.contains('active');
    }

    // Attach scroll event listener if on home page and no friends are added
    if (isOnHomePage() && friendsImagesData.length === 0 ||isOnHomePage() && friendsImagesData.length <= 1 ) {
        window.addEventListener('scroll', handleScroll);
        document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
        document.body.style.overflow = "auto"; // Allow scrolling if not on the home page or there are friends
    }

    // Listen for navigation changes and adjust scrolling behavior accordingly
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => { // Add a delay to ensure the active class is updated
                if (isOnHomePage() && friendsImagesData.length === 0) {
                    window.addEventListener('scroll', handleScroll);
                    document.body.style.overflow = "hidden"; // Prevent scrolling
                } else {
                    window.removeEventListener('scroll', handleScroll);
                    document.body.style.overflow = "auto"; // Allow scrolling
                }
            }, 100);
        });
    });
});







