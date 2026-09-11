// ======================================================
// 1. FIREBASE
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyDAbJeFuZxncwk_RGcIbxyAyEG_HrRqXwQ",
    authDomain: "mirai-birthday.firebaseapp.com",
    projectId: "mirai-birthday",
    storageBucket: "mirai-birthday.firebasestorage.app",
    messagingSenderId: "297818759328",
    appId: "1:297818759328:web:2cb67d88614500ad37a9c5",
    measurementId: "G-N9THVMRBHM"
};


// Firebase imports
import { initializeApp }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
}
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ======================================================
// 2. HELPER FUNCTIONS
// ======================================================

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


// ======================================================
// 3. TOAST
// ======================================================

function showToast(message) {
    const toast = $("#toast");
    const toastMessage = $("#toast-message");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// ======================================================
// 4. CONFETTI
// ======================================================

function launchConfetti() {

    const container = $("#confetti-container");

    if (!container) return;

    const colors = [
        "#8b5cf6",
        "#c084fc",
        "#f0abfc",
        "#f9a8d4",
        "#fde68a",
        "#ffffff"
    ];

    for (let i = 0; i < 120; i++) {

        const confetti = document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * 100 + "%";

        confetti.style.top = "-20px";

        confetti.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.width =
            Math.random() * 8 + 5 + "px";

        confetti.style.height =
            Math.random() * 14 + 6 + "px";

        confetti.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        confetti.style.animationDuration =
            Math.random() * 2 + 2 + "s";

        confetti.style.animationDelay =
            Math.random() * 0.5 + "s";

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}


// ======================================================
// 5. COUNTDOWN
// ======================================================

const daysElement = $("#days");
const hoursElement = $("#hours");
const minutesElement = $("#minutes");
const secondsElement = $("#seconds");

function getNextBirthday() {

    const now = new Date();

    let year = now.getFullYear();

    let birthday = new Date(
    year,
    8,       // September = 8
    10,      // Day 10
    0,
    0,
    0
);
    if (birthday <= now) {
        birthday = new Date(
    year + 1,
    8,
    10,
    0,
    0,
    0
);
    }

    return birthday;
}


function updateCountdown() {

    const now = new Date();

    const birthday = getNextBirthday();

    const difference = birthday - now;

    if (difference <= 0) return;
    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );


    if (daysElement)
        daysElement.textContent = String(days).padStart(2, "0");

    if (hoursElement)
        hoursElement.textContent = String(hours).padStart(2, "0");

    if (minutesElement)
        minutesElement.textContent = String(minutes).padStart(2, "0");

    if (secondsElement)
        secondsElement.textContent = String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


// Clicking countdown = confetti
const countdownButton = $("#countdown");

if (countdownButton) {

    countdownButton.addEventListener("click", () => {

        launchConfetti();

        showToast("Can't wait for Mirai's birthday! 🥳💜");

    });
}


// ======================================================
// 6. GALLERY CODE
// ======================================================

const CORRECT_GALLERY_CODE = "MARIAM10";

const galleryLock = $("#gallery-lock");
const galleryHand = $("#gallery-hand");
const galleryContent = $("#gallery-content");

const galleryCode = $("#gallery-code");
const galleryUnlock = $("#gallery-unlock");
const galleryError = $("#gallery-error");


if (galleryUnlock) {

    galleryUnlock.addEventListener("click", () => {

        const enteredCode =
            galleryCode.value.trim().toUpperCase();


        if (enteredCode === CORRECT_GALLERY_CODE) {

    galleryLock.classList.add("hidden");
    galleryHand.classList.remove("hidden");

    galleryError.textContent = "";

    showToast("Correct code! 🫴💜");
        } else {

            galleryError.textContent =
                "Wrong code 😭 Try again!";

            galleryCode.value = "";

        }

    });
}


// ======================================================
// 7. HOLD HAND FOR 2 SECONDS
// ======================================================

let holdTimer = null;
let holdingHand = false;


function startHoldingHand(event) {

    event.preventDefault();

    if (holdingHand) return;

    holdingHand = true;

    galleryHand.classList.add("holding");

    holdTimer = setTimeout(() => {

        holdingHand = false;

        galleryHand.classList.remove("holding");

        galleryHand.classList.add("hidden");
galleryContent.classList.remove("hidden");

        showToast("Welcome to Mirai's memories! 🥹💜");

        loadFirebasePhotos();

    }, 2000);
}


function stopHoldingHand() {

    if (!holdingHand) return;

    holdingHand = false;

    clearTimeout(holdTimer);

    galleryHand.classList.remove("holding");
}


if (galleryHand) {

    galleryHand.addEventListener(
        "mousedown",
        startHoldingHand
    );

    galleryHand.addEventListener(
        "mouseup",
        stopHoldingHand
    );

    galleryHand.addEventListener(
        "mouseleave",
        stopHoldingHand
    );

    galleryHand.addEventListener(
        "touchstart",
        startHoldingHand,
        { passive: false }
    );

    galleryHand.addEventListener(
        "touchend",
        stopHoldingHand
    );

    galleryHand.addEventListener(
        "touchcancel",
        stopHoldingHand
    );
}


// ======================================================
// 8. GALLERY IMAGE MODAL
// ======================================================

const imageModal = $("#image-modal");
const modalImage = $("#modal-image");
const closeImageModal = $("#close-image-modal");


function openImageModal(src) {

    if (!imageModal || !modalImage) return;

    modalImage.src = src;

    imageModal.classList.add("show");
}


function closeImage() {

    if (!imageModal) return;

    imageModal.classList.remove("show");
}


if (closeImageModal) {

    closeImageModal.addEventListener(
        "click",
        closeImage
    );
}


if (imageModal) {
    imageModal.addEventListener("click", (event) => {

        if (event.target === imageModal) {
            closeImage();
        }

    });
}


// Local gallery images
function activateGalleryImages() {

    const images = $$(".gallery-track img");

    images.forEach(image => {

        image.addEventListener("click", () => {

            openImageModal(image.src);

        });

    });
}


activateGalleryImages();


// ======================================================
// 9. AUTO SCROLL GALLERY
// ======================================================

const galleryTrack = $(".gallery-track");

let galleryScrolling = true;


if (galleryTrack) {

    galleryTrack.addEventListener(
        "mouseenter",
        () => galleryScrolling = false
    );

    galleryTrack.addEventListener(
        "mouseleave",
        () => galleryScrolling = true
    );

    galleryTrack.addEventListener(
        "touchstart",
        () => galleryScrolling = false
    );

    galleryTrack.addEventListener(
        "touchend",
        () => {

            setTimeout(() => {
                galleryScrolling = true;
            }, 1000);

        }
    );


    function scrollGallery() {

        if (
            galleryScrolling &&
            galleryContent &&
            galleryContent.style.display !== "none"
        ) {

            galleryTrack.scrollLeft += 1;

            if (
                galleryTrack.scrollLeft +
                galleryTrack.clientWidth >=
                galleryTrack.scrollWidth - 2
            ) {

                galleryTrack.scrollLeft = 0;

            }

        }

        requestAnimationFrame(scrollGallery);
    }


    scrollGallery();
}


// ======================================================
// 10. LOAD FIREBASE PHOTOS
// ======================================================

async function loadFirebasePhotos() {

    try {

        const photosSnapshot =
            await getDocs(collection(db, "photos"));

        const photos = [];

        photosSnapshot.forEach(doc => {

            photos.push({
                id: doc.id,
                ...doc.data()
            });

        });


        photos.sort((a, b) => {

            const dateA =
                a.createdAt?.seconds || 0;

            const dateB =
                b.createdAt?.seconds || 0;

            return dateA - dateB;

        });


        photos.forEach(photo => {

            if (!photo.url) return;

            addPhotoToGallery(photo.url);

        });


    } catch (error) {

        console.error(
            "Error loading photos:",
            error
        );

    }
}


// Add Firebase photo to gallery
function addPhotoToGallery(url) {

    if (!galleryTrack) return;

    const image = document.createElement("img");

    image.src = url;

    image.alt = "Mirai memory";

    image.loading = "lazy";

    image.addEventListener("click", () => {

        openImageModal(url);

    });

    galleryTrack.appendChild(image);
}


// ======================================================
// 11. STORIES
// ======================================================

const storyForm = $("#story-form");

const storyName = $("#story-name");
const storyText = $("#story-text");

const storiesContainer = $("#stories-container");


if (storyForm) {

    storyForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const name =
                storyName.value.trim();

            const story =
                storyText.value.trim();


            if (!name || !story) {

                showToast(
                    "Please fill in both fields 💜"
                );

                return;
            }


            try {

                await addDoc(
                    collection(db, "stories"),
                    {
                        name: name,
                        story: story,
                        createdAt: serverTimestamp()
                    }
                );
                showToast(
                    "Your story was added! 🥹💜"
                );


                storyForm.reset();

                loadStories();


            } catch (error) {

                console.error(error);

                showToast(
                    "Something went wrong 😭"
                );

            }

        }
    );
}


// ======================================================
// 12. LOAD STORIES
// ======================================================

async function loadStories() {

    if (!storiesContainer) return;

    try {

        const snapshot =
            await getDocs(
                collection(db, "stories")
            );


        const stories = [];

        snapshot.forEach(doc => {

            stories.push({
                id: doc.id,
                ...doc.data()
            });

        });


        stories.sort((a, b) => {

            const dateA =
                a.createdAt?.seconds || 0;

            const dateB =
                b.createdAt?.seconds || 0;

            return dateB - dateA;

        });


        storiesContainer.innerHTML = "";


        if (stories.length === 0) {

            storiesContainer.innerHTML = `
                <p class="empty-message">
                    Be the first one to write something for Mirai 💜
                </p>
            `;

            return;
        }


        stories.forEach(item => {

            const card =
                document.createElement("div");

            card.className = "story-card";


            const shortStory =
                item.story.length > 100
                    ? item.story.substring(0, 100) + "..."
                    : item.story;


            card.innerHTML = `
                <h3>${escapeHTML(item.name)}</h3>

                <p>
                    ${escapeHTML(shortStory)}
                </p>

                <span>
                    Click to read more 💜
                </span>
            `;


            card.addEventListener(
                "click",
                () => openStoryModal(item)
            );


            storiesContainer.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Error loading stories:",
            error
        );

    }
}


loadStories();


// ======================================================
// 13. STORY MODAL
// ======================================================

const storyModal = $("#story-modal");

const closeStoryModalButton =
    $("#close-story-modal");

const modalStoryName =
    $("#modal-story-name");

const modalStoryText =
    $("#modal-story-text");


function openStoryModal(story) {

    if (!storyModal) return;

    modalStoryName.textContent =
        story.name;

    modalStoryText.textContent =
        story.story;

    storyModal.classList.add("show");
}


function closeStory() {

    if (!storyModal) return;

    storyModal.classList.remove("show");
}


if (closeStoryModalButton) {

    closeStoryModalButton.addEventListener(
        "click",
        closeStory
    );
}


if (storyModal) {

    storyModal.addEventListener(
        "click",
        (event) => {

            if (event.target === storyModal) {
                closeStory();
            }

        }
    );
}


// ======================================================
// 14. PHOTO PREVIEW
// ======================================================

const photoFile = $("#photo-file");
const previewImage = $("#preview-image");
const photoPreview = $("#photo-preview");


if (photoFile) {

    photoFile.addEventListener(
        "change",
        () => {

            const file =
                photoFile.files[0];

            if (!file) return;


            if (!file.type.startsWith("image/")) {

                showToast(
                    "Please choose an image 📷"
                );

                photoFile.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload = (event) => {
                previewImage.src =
                    event.target.result;

                photoPreview.style.display =
                    "block";

            };


            reader.readAsDataURL(file);

        }
    );
}


// ======================================================
// 15. PHOTO UPLOAD
// ======================================================

const photoForm = $("#photo-form");

if (photoForm) {

    photoForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            showToast(
                "Photo upload will be available soon! 📸💜"
            );

        }
    );
}

// ======================================================
// 16. QUIZ QUESTIONS
// ======================================================

const questions = [

    {
        question: "Mirai's Favorite Food",
        options: [
            "برجر و مكرونه",
            "بيتزا و كريب",
            "سوري و نودلز",
            "شبسي و باتيه"
        ],
        correct: 2
    },

    {
        question: "Mirai's Favorite drink",
        options: [
            "لمون نعناع و ايس كوفي",
            "شاي",
            "قهوه",
            "لمون نعناع و هوت شوكلت"
        ],
        correct: 0
    },

    {
        question: "Mirai's favorite season",
        options: [
            "الشتاء",
            "خريف",
            "الصيف",
            "ربيع"
        ],
        correct: 2
    },

    {
        question: "Mirai's favorite book",
        options: [
            "ارض زيكولا",
            "نوح الالفي",
            "اكستاسي",
            "لانها كيارا"
        ],
        correct: 1
    },

    {
        question: "Mirai's favorite color",
        options: [
            "💜",
            "💛",
            "🩵",
            "🖤"
        ],
        correct: 0
    },
    {
        question: "A place she goes to when she's upset",
        options: [
            "اودتها",
            "وسط البلد",
            "بيت نهى",
            "بيت مريم"
        ],
        correct: 0
    },

    {
        question: "Mirai's favorite Government",
        options: [
            "هي عاوزه تسيب مصر اصلا",
            "هي بتحب اسمعليه عشانه",
            "بتحب اسكندريه وبحر اسكندريه",
            "القاهرة محفظتها و العشق"
        ],
        correct: 0
    },

    {
        question: "Mirai's favorite country",
        options: [
            "الصين",
            "اليبان",
            "كندا",
            "افغنستان"
        ],
        correct: 2
    },

    {
        question: "Mirai's favorite movie",
        options: [
            "سبيدر مان",
            "افلام مارڤل",
            "هاري بوتر",
            "عسل اسود"
        ],
        correct: 2
    },

    {
        question: "Mirai's favorite series",
        options: [
            "لام شمسيه",
            "twinkling watermelon",
            "TVD",
            "Echo"
        ],
        correct: 1
    },

    {
        question: "Mirai's EMPT",
        options: [
            "ENFJ",
            "INFJ",
            "INFP",
            "ENTJ"
        ],
        correct: 3
    },

    {
        question: "Mirai's favorite cartoon",
        options: [
            "سيندرلا",
            "انيوشا",
            "كونان",
            "جامبول"
        ],
        correct: 3
    },

    {
        question: "The word she says most often",
        options: [
            "يالهوي",
            "اعععع",
            "اهااا",
            "اك"
        ],
        correct: 1
    },

    {
        question: "She has a phobia of",
        options: [
            "الصرصير",
            "الدم",
            "الكلاب",
            "المهرجين"
        ],
        correct: 1
    },

    {
        question: "Her length",
        options: [
            "150 اوزعه",
            "160 اوزعه",
            "155 اوزعه",
            "140 اوزعه برو ماكس"
        ],
        correct: 2
    },

    {
        question: "Her foot size",
        options: [
            "36",
            "38",
            "40",
            "42"
        ],
        correct: 1
    },

    {
        question: "Mirai's favorite song",
        options: [
            "كل الاغاني",
            "كل اغاني عمر دياب",
            "كل اغاني توليت",
            "مبتحبش الاغاني"
        ],
        correct: 0
    },

    {
        question: "Mirai's favorite App",
        options: [
            "Tik tok",
            "Snapchat",
            "Instagram",
            "Facebook"
        ],
        correct: 0
    },

    {
        question: "She studying",
        options: [
            "BIS",
            "طب",
            "سباكه",
            "بترول"
        ],
        correct: 0
    },

    {
        question: "Her name",
        options: [
            "مريم",
            "منه",
            "ملك",
            "مرام"
        ],
        correct: 0
    }

];


// ======================================================
// 17. QUIZ VARIABLES
// ======================================================

let currentQuestion = 0;

let quizScore = 0;

let selectedAnswer = null;

let playerName = "";


// ======================================================
// 18. QUIZ ELEMENTS
// ======================================================

const quizStart = $("#quiz-start");

const playerNameInput =
    $("#player-name");

const startQuizButton =
    $("#start-quiz");

const quizGame =
    $("#quiz-game");

const questionNumber =
    $("#question-number");

const currentScore =
    $("#current-score");

const questionText =
    $("#question-text");

const answerOptions =
    $("#answer-options");

const nextQuestionButton =
    $("#next-question");

const quizResult =
    $("#quiz-result");

const resultName =
    $("#result-name");

const finalScore =
    $("#final-score");

const leaderboard =
    $("#leaderboard");

const leaderboardList =
    $("#leaderboard-list");
// ======================================================
// 19. START QUIZ
// ======================================================

if (startQuizButton) {

    startQuizButton.addEventListener(
        "click",
        () => {

            playerName =
                playerNameInput.value.trim();


            if (!playerName) {

                showToast(
                    "Enter your name first 💜"
                );

                return;
            }


            currentQuestion = 0;

            quizScore = 0;

            selectedAnswer = null;


            quizStart.classList.add("hidden");
quizResult.classList.add("hidden");
quizGame.classList.remove("hidden");


            showQuestion();

        }
    );
}


// ======================================================
// 20. SHOW QUESTION
// ======================================================

function showQuestion() {

    const question =
        questions[currentQuestion];


    selectedAnswer = null;


    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;


    currentScore.textContent =
        `Score: ${quizScore}`;


    questionText.textContent =
        question.question;


    answerOptions.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");


            button.className =
                "answer-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                () => {

                    selectAnswer(
                        index,
                        button
                    );

                }
            );


            answerOptions.appendChild(
                button
            );

        }
    );


    nextQuestionButton.disabled =
        true;


    nextQuestionButton.textContent =
        currentQuestion === questions.length - 1
            ? "Finish 🎉"
            : "Next ➜";
}


// ======================================================
// 21. SELECT ANSWER
// ======================================================

function selectAnswer(index, button) {

    if (selectedAnswer !== null) return;


    selectedAnswer = index;


    const buttons =
        $$(".answer-option");


    buttons.forEach(
        btn => btn.disabled = true
    );


    const correctAnswer =
        questions[currentQuestion].correct;


    if (index === correctAnswer) {

        button.classList.add("correct");

        quizScore++;

        showToast("Correct! 🎉💜");

    } else {

        button.classList.add("wrong");

        buttons[
            correctAnswer
        ].classList.add("correct");

        showToast("Oops! 😭");

    }


    currentScore.textContent =
        `Score: ${quizScore}`;


    nextQuestionButton.disabled =
        false;
}


// ======================================================
// 22. NEXT QUESTION
// ======================================================

if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        () => {

            if (selectedAnswer === null) {

                showToast(
                    "Choose an answer first 👀"
                );

                return;
            }


            currentQuestion++;


            if (
                currentQuestion >=
                questions.length
            ) {

                finishQuiz();

            } else {

                showQuestion();

            }

        }
    );
}


// ======================================================
// 23. FINISH QUIZ
// ======================================================

async function finishQuiz() {

    quizGame.classList.add("hidden");
quizResult.classList.remove("hidden");


    resultName.textContent =
        playerName;


    finalScore.textContent =
        `${quizScore} / ${questions.length}`;


    launchConfetti();


    try {
        await addDoc(
            collection(db, "quizResults"),
            {
                name: playerName,
                score: quizScore,
                total: questions.length,
                createdAt: serverTimestamp()
            }
        );


        loadLeaderboard();


    } catch (error) {

        console.error(
            "Quiz result error:",
            error
        );

    }

}


// ======================================================
// 24. LEADERBOARD
// ======================================================

async function loadLeaderboard() {

    if (!leaderboardList) return;


    try {

        const snapshot =
            await getDocs(
                collection(db, "quizResults")
            );


        const results = [];


        snapshot.forEach(doc => {

            results.push({
                id: doc.id,
                ...doc.data()
            });

        });


        results.sort((a, b) => {

            if (b.score !== a.score) {

                return b.score - a.score;

            }


            const dateA =
                a.createdAt?.seconds || 0;

            const dateB =
                b.createdAt?.seconds || 0;


            return dateA - dateB;

        });


        leaderboardList.innerHTML = "";


        if (results.length === 0) {

            leaderboardList.innerHTML = `
                <p>No scores yet 👀</p>
            `;

            return;
        }


        results.forEach(
            (result, index) => {

                const row =
                    document.createElement("div");


                row.className =
                    "leaderboard-row";


                row.innerHTML = `
                    <span class="rank">
                        #${index + 1}
                    </span>

                    <span class="leader-name">
                        ${escapeHTML(result.name)}
                    </span>

                    <span class="leader-score">
                        ${result.score}/${result.total || 20}
                    </span>
                `;


                leaderboardList.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );

    }
}


loadLeaderboard();


// ======================================================
// 25. HTML ESCAPE
// ======================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


// ======================================================
// 26. CLOSE MODALS WITH ESC
// ======================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") return;

        if (imageModal) {
            imageModal.classList.remove("show");
        }

        if (storyModal) {
            storyModal.classList.remove("show");
        }

    }
);


// ======================================================
// 27. SMOOTH NAVIGATION
// ======================================================

$$('a[href^="#"]').forEach(link => {

    link.addEventListener(
        "click",
        (event) => {

            const targetId =
                link.getAttribute("href");

            const target =
                document.querySelector(targetId);


            if (!target) return;


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

});


// ======================================================
// 28. WELCOME MESSAGE
// ======================================================

console.log(
    "💜 Mirai's Birthday Website is running!"
);
