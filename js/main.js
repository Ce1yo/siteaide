// Animation des éléments au défilement
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Configuration de l'Intersection Observer
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Animation des sections
        document.querySelectorAll('.section').forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 0.6s ease-out';
            section.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(section);
        });

        // Animation des cartes
        document.querySelectorAll('.aide-card, .service-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease-out';
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // Animation douce du défilement pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Amélioration des transitions des modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        
        // Réinitialiser l'opacité et la position avant d'afficher
        modal.style.opacity = '0';
        modal.style.display = 'block';
        
        // Force le reflow pour assurer une animation fluide
        modal.offsetHeight;
        modal.classList.add('active');
        
        // Animation progressive
        setTimeout(() => {
            modal.style.opacity = '1';
            
            // Gestion du focus
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length) {
                focusableElements[0].focus();
            }
        }, 10);
        
        document.body.style.overflow = 'hidden';
        modal.lastFocus = document.activeElement;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Restaure le focus
            if (modal.lastFocus) {
                modal.lastFocus.focus();
            }
        }, 300);
    }
}

// Gestionnaires d'événements pour les modales
document.addEventListener('click', (e) => {
    if (e.target.closest('.aide-card, .service-card')) {
        const modalId = e.target.closest('.aide-card, .service-card').getAttribute('data-modal');
        if (modalId) openModal(modalId);
    }
    
    // Fermeture en cliquant en dehors de la modale
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Fermeture avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal[style*="display: block"]');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Animation douce pour le défilement des ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Sélectionner toutes les cartes de service et d'aide
    const cards = document.querySelectorAll('.service-card, .aide-card');
    
    // Ajouter les écouteurs d'événements pour chaque carte
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (!modalId) {
                console.error('Pas d\'attribut data-modal trouvé pour cette carte');
                return;
            }
            
            const modal = document.getElementById(modalId);
            if (!modal) {
                console.error('Modal non trouvée:', modalId);
                return;
            }
            
            // Ouvrir la modale
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Gérer la fermeture des modales
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Empêcher la propagation du clic
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Fermer la modale en cliquant en dehors
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });

    // Empêcher la propagation des clics dans le contenu de la modale
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Ajout de la classe active au menu lors du défilement
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150 && window.pageYOffset < sectionTop + sectionHeight - 150) {
                const currentId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('menu-open');
            document.body.style.overflow = nav.classList.contains('menu-open') ? 'hidden' : '';
        });

        // Fermer le menu en cliquant sur l'overlay
        menuOverlay.addEventListener('click', () => {
            nav.classList.remove('menu-open');
            document.body.style.overflow = '';
        });

        // Fermer le menu après avoir cliqué sur un lien
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });

        // Empêcher la fermeture lors du clic sur le menu lui-même
        nav.querySelector('ul').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Nouvelle gestion du chat ServIA
    const serviaButton = document.getElementById('serviaButton');
    const chatContainer = document.getElementById('chatContainer');
    const minimizeChat = document.getElementById('minimizeChat');
    const chatMessages = document.getElementById('chatMessages');
    const resetChat = document.getElementById('resetChat');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');

    // Configuration du chatbot ServIA
    const ServIA = {
        // Structure des conversations
        flow: {
            start: {
                message: "Bonjour ! Je suis ServIA, votre assistant virtuel. Pour qui cherchez-vous de l'aide ?",
                choices: [
                    { text: "Pour une personne âgée", value: "senior" },
                    { text: "Pour une personne en situation de handicap", value: "handicap" },
                    { text: "Pour un enfant", value: "enfant" },
                    { text: "Pour moi-même", value: "self" }
                ]
            },
            senior: {
                message: "Je vais vous aider à trouver les aides adaptées. Quelle est la situation ?",
                choices: [
                    { text: "Besoin d'aide au quotidien", value: "daily" },
                    { text: "Sortie d'hospitalisation", value: "hospital" },
                    { text: "Difficultés de déplacement", value: "mobility" },
                    { text: "Difficultés financières", value: "financial" }
                ]
            },
            handicap: {
                message: "Je comprends. Quel type d'aide recherchez-vous principalement ?",
                choices: [
                    { text: "Aide à la vie quotidienne", value: "daily" },
                    { text: "Aménagement du logement", value: "home" },
                    { text: "Aide à la mobilité", value: "mobility" },
                    { text: "Soutien financier", value: "financial" }
                ]
            },
            enfant: {
                message: "Je vais vous aider pour votre enfant. Quelle est votre situation ?",
                choices: [
                    { text: "Garde d'enfant à domicile", value: "care" },
                    { text: "Enfant en situation de handicap", value: "special" },
                    { text: "Aide aux devoirs", value: "homework" },
                    { text: "Autre besoin", value: "other" }
                ]
            },
            self: {
                message: "Je vais vous aider. Quelle est votre situation actuelle ?",
                choices: [
                    { text: "En perte d'autonomie", value: "autonomy" },
                    { text: "En situation de handicap", value: "disability" },
                    { text: "Besoin d'aide temporaire", value: "temporary" },
                    { text: "Difficultés financières", value: "financial" }
                ]
            }
        },

        // Recommandations d'aides selon le profil et la situation
        recommendations: {
            senior: {
                daily: {
                    message: "Voici les aides adaptées pour l'aide au quotidien :",
                    aides: ["APA", "AMD", "Crédit d'Impôt"]
                },
                hospital: {
                    message: "Pour une sortie d'hospitalisation, ces aides peuvent vous aider :",
                    aides: ["Aide à domicile momentanée", "APA", "MTP"]
                },
                mobility: {
                    message: "Pour faciliter les déplacements, voici les aides disponibles :",
                    aides: ["Sortir Plus", "APA", "PCH"]
                },
                financial: {
                    message: "Pour le soutien financier, voici les aides disponibles :",
                    aides: ["Crédit d'Impôt"]
                }
            },
            handicap: {
                daily: {
                    message: "Pour l'aide à la vie quotidienne, voici les aides adaptées :",
                    aides: ["PCH", "MTP", "Crédit d'Impôt"]
                },
                home: {
                    message: "Pour l'aménagement du logement, ces aides sont disponibles :",
                    aides: ["PCH", "APA", "Crédit d'Impôt"]
                },
                mobility: {
                    message: "Pour l'aide à la mobilité, vous pouvez bénéficier de :",
                    aides: ["PCH", "Sortir Plus", "MTP"]
                },
                financial: {
                    message: "Pour le soutien financier, voici les aides possibles :",
                    aides: ["PCH", "Crédit d'Impôt"]
                }
            },
            enfant: {
                care: {
                    message: "Pour la garde d'enfant à domicile, voici les aides disponibles :",
                    aides: ["PAJE", "Crédit d'Impôt"]
                },
                special: {
                    message: "Pour un enfant en situation de handicap, ces aides peuvent vous aider :",
                    aides: ["PCH", "AEEH", "Crédit d'Impôt"]
                },
                homework: {
                    message: "Pour l'aide aux devoirs, vous pouvez bénéficier de :",
                    aides: ["Crédit d'Impôt", "PAJE"]
                },
                other: {
                    message: "Voici les aides générales pour les enfants :",
                    aides: ["PAJE", "Crédit d'Impôt"]
                }
            },
            self: {
                autonomy: {
                    message: "Pour vous aider à maintenir votre autonomie :",
                    aides: ["APA", "AMD", "Crédit d'Impôt"]
                },
                disability: {
                    message: "En tant que personne en situation de handicap, vous pouvez bénéficier de :",
                    aides: ["PCH", "Crédit d'Impôt"]
                },
                temporary: {
                    message: "Pour une aide temporaire, voici les dispositifs disponibles :",
                    aides: ["Aide à domicile momentanée", "Crédit d'Impôt"]
                },
                financial: {
                    message: "Pour vous aider financièrement, ces aides sont disponibles :",
                    aides: ["Crédit d'Impôt"]
                }
            }
        },

        // Informations sur les aides
        aides: {
            'APA': {
                title: "Allocation Personnalisée d'Autonomie",
                description: "Aide financière pour les personnes âgées en perte d'autonomie",
                url: "https://www.service-public.fr/particuliers/vosdroits/F10009"
            },
            'PCH': {
                title: "Prestation de Compensation du Handicap",
                description: "Aide financière pour les personnes en situation de handicap",
                url: "https://www.service-public.fr/particuliers/vosdroits/F14202"
            },
            'PAJE': {
                title: "Prestation d'Accueil du Jeune Enfant",
                description: "Aide financière pour la garde d'enfant",
                url: "https://www.service-public.fr/particuliers/vosdroits/F2552"
            },
            'Crédit d\'Impôt': {
                title: "Crédit d'Impôt Services à la Personne",
                description: "Réduction fiscale pour l'emploi d'un salarié à domicile",
                url: "https://www.service-public.fr/particuliers/vosdroits/F12"
            },
            'Aide à domicile momentanée': {
                title: "Aide à Domicile Momentanée",
                description: "Aide temporaire suite à une hospitalisation ou un événement",
                url: "https://www.agirc-arrco.fr/action-sociale/aide-domicile-momentanee/"
            },
            'Sortir Plus': {
                title: "Sortir Plus",
                description: "Accompagnement pour les sorties et déplacements",
                url: "https://www.agirc-arrco.fr/action-sociale/sortir-plus/"
            },
            'AMD': {
                title: "Aide Ménagère à Domicile",
                description: "Aide pour l'entretien du logement et les tâches quotidiennes",
                url: "https://www.service-public.fr/particuliers/vosdroits/F245"
            },
            'MTP': {
                title: "Majoration pour Tierce Personne",
                description: "Aide financière pour les personnes nécessitant une aide constante",
                url: "https://www.service-public.fr/particuliers/vosdroits/F31434"
            },
            'AEEH': {
                title: "Allocation d'Éducation de l'Enfant Handicapé",
                description: "Aide financière pour les enfants en situation de handicap",
                url: "https://www.service-public.fr/particuliers/vosdroits/F161"
            }
        }
    };

    // État de la conversation
    let conversationState = {
        currentStep: 'start',
        profile: null,
        situation: null
    };

    // Initialisation du chat
    function initializeChat() {
        const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const chatMessages = document.getElementById('chatMessages');
        const chatChoices = document.getElementById('chatChoices');
        const minimizeChat = document.getElementById('minimizeChat');
        const resetChat = document.getElementById('resetChat');

        if (!chatToggle || !chatWindow || !chatMessages || !chatChoices) {
            console.error('Éléments du chat non trouvés');
            return;
        }

        // Fonctions d'affichage
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            messageDiv.textContent = content;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showChoices(choices) {
            chatChoices.innerHTML = '';
            choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                button.onclick = () => handleChoice(choice.value);
                chatChoices.appendChild(button);
            });
        }

        function showAideRecommendations(recommendations) {
            const message = recommendations.message;
            addMessage(message);
            
            recommendations.aides.forEach(aideId => {
                const aide = ServIA.aides[aideId];
                if (!aide) return;
                
                const aideDiv = document.createElement('div');
                aideDiv.className = 'aide-suggestion';
                aideDiv.innerHTML = `
                    <strong>${aide.title}</strong><br>
                    ${aide.description}<br>
                    <a href="${aide.url}" target="_blank">En savoir plus →</a>
                `;
                chatMessages.appendChild(aideDiv);
            });
            
            // Ajouter un bouton pour recommencer
            const restartButton = document.createElement('button');
            restartButton.className = 'choice-btn';
            restartButton.textContent = "Poser une nouvelle question";
            restartButton.onclick = resetConversation;
            chatChoices.innerHTML = '';
            chatChoices.appendChild(restartButton);
        }

        // Gestion des choix
        function handleChoice(value) {
            const currentFlow = ServIA.flow[conversationState.currentStep];
            if (!currentFlow) return;

            const choice = currentFlow.choices.find(c => c.value === value);
            if (!choice) return;

            addMessage(choice.text, true);

            if (!conversationState.profile) {
                conversationState.profile = value;
                conversationState.currentStep = value;
                const nextFlow = ServIA.flow[value];
                if (nextFlow) {
                    addMessage(nextFlow.message);
                    showChoices(nextFlow.choices);
                }
            } else {
                conversationState.situation = value;
                const recommendations = ServIA.recommendations[conversationState.profile][value];
                if (recommendations) {
                    showAideRecommendations(recommendations);
                }
            }
        }

        // Réinitialisation de la conversation
        function resetConversation() {
            conversationState = { currentStep: 'start', profile: null, situation: null };
            chatMessages.innerHTML = '';
            addMessage(ServIA.flow.start.message);
            showChoices(ServIA.flow.start.choices);
        }

        // Événements
        chatToggle.onclick = () => {
            const isVisible = chatWindow.style.display === 'flex';
            chatWindow.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && chatMessages.children.length === 0) {
                resetConversation();
            }
        };

        minimizeChat.onclick = () => {
            chatWindow.style.display = 'none';
        };

        resetChat.onclick = resetConversation;
    }

    // S'assurer que le DOM est chargé avant d'initialiser
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChat);
    } else {
        initializeChat();
    }
});