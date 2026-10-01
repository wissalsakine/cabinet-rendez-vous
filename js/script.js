/* =====================================================
   CABINET SANTÉ
   JAVASCRIPT
===================================================== */


/* =====================================================
   UTILITAIRES
===================================================== */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("cabinetUsers")
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "cabinetUsers",
        JSON.stringify(users)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );

}


function saveCurrentUser(user) {

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

}


function getAppointments() {

    return JSON.parse(
        localStorage.getItem("cabinetAppointments")
    ) || [];

}


function saveAppointments(appointments) {

    localStorage.setItem(
        "cabinetAppointments",
        JSON.stringify(appointments)
    );

}


/* =====================================================
   INSCRIPTION
===================================================== */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById("name").value.trim();


            const email =
                document.getElementById("email").value
                .trim()
                .toLowerCase();


            const phone =
                document.getElementById("phone").value.trim();


            const password =
                document.getElementById("password").value;


            const confirmPassword =
                document.getElementById("confirmPassword").value;


            const message =
                document.getElementById("registerMessage");


            /* Vérification du mot de passe */

            if (password.length < 6) {

                message.innerHTML = `
                    <div class="message error">
                        Le mot de passe doit contenir
                        au moins 6 caractères.
                    </div>
                `;

                return;

            }


            /* Vérification des mots de passe */

            if (password !== confirmPassword) {

                message.innerHTML = `
                    <div class="message error">
                        Les mots de passe ne correspondent pas.
                    </div>
                `;

                return;

            }


            /* Récupérer les utilisateurs */

            const users = getUsers();


            /* Vérifier si email existe */

            const existingUser =
                users.find(
                    user => user.email === email
                );


            if (existingUser) {

                message.innerHTML = `
                    <div class="message error">
                        Cette adresse email est déjà utilisée.
                    </div>
                `;

                return;

            }


            /* Créer utilisateur */

            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                phone: phone,

                password: password

            };


            users.push(newUser);


            saveUsers(users);


            message.innerHTML = `
                <div class="message success">
                    Compte créé avec succès !
                    Redirection vers la connexion...
                </div>
            `;


            /* Redirection */

            setTimeout(function() {

                window.location.href =
                    "connexion.html";

            }, 1500);


        }
    );

}


/* =====================================================
   CONNEXION
===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


            const password =
                document.getElementById("loginPassword")
                .value;


            const message =
                document.getElementById("loginMessage");


            const users = getUsers();


            /* Rechercher utilisateur */

            const user =
                users.find(
                    user =>
                        user.email === email &&
                        user.password === password
                );


            if (!user) {

                message.innerHTML = `
                    <div class="message error">
                        Email ou mot de passe incorrect.
                    </div>
                `;

                return;

            }


            /* Enregistrer utilisateur connecté */

            saveCurrentUser(user);


            message.innerHTML = `
                <div class="message success">
                    Connexion réussie !
                    Redirection...
                </div>
            `;


            setTimeout(function() {

                window.location.href =
                    "dashboard.html";

            }, 1000);


        }
    );

}


/* =====================================================
   DATE MINIMUM
===================================================== */

const appointmentDate =
    document.getElementById("appointmentDate");


if (appointmentDate) {

    const today =
        new Date().toISOString().split("T")[0];

    appointmentDate.min = today;

}


/* =====================================================
   RENDEZ-VOUS
===================================================== */

const appointmentForm =
    document.getElementById("appointmentForm");


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "appointmentMessage"
                );


            /* Vérifier connexion */

            const currentUser =
                getCurrentUser();


            if (!currentUser) {

                message.innerHTML = `
                    <div class="message error">
                        Vous devez être connecté pour
                        prendre un rendez-vous.
                        <br><br>
                        <a href="connexion.html">
                            Se connecter
                        </a>
                    </div>
                `;

                return;

            }


            /* Récupérer données */

            const speciality =
                document.getElementById(
                    "speciality"
                ).value;


            const doctor =
                document.getElementById(
                    "doctor"
                ).value;


            const date =
                document.getElementById(
                    "appointmentDate"
                ).value;


            const time =
                document.getElementById(
                    "appointmentTime"
                ).value;


            const reason =
                document.getElementById(
                    "reason"
                ).value;


            /* Vérifier disponibilité */

            const appointments =
                getAppointments();


            const alreadyBooked =
                appointments.some(
                    appointment =>
                        appointment.doctor === doctor &&
                        appointment.date === date &&
                        appointment.time === time
                );


            if (alreadyBooked) {

                message.innerHTML = `
                    <div class="message error">
                        Ce créneau est déjà réservé.
                        Veuillez choisir une autre heure.
                    </div>
                `;

                return;

            }


            /* Créer rendez-vous */

            const newAppointment = {

                id: Date.now(),

                userId: currentUser.id,

                patientName: currentUser.name,

                patientEmail: currentUser.email,

                speciality: speciality,

                doctor: doctor,

                date: date,

                time: time,

                reason: reason,

                status: "Confirmé"

            };


            appointments.push(
                newAppointment
            );


            saveAppointments(
                appointments
            );


            message.innerHTML = `
                <div class="message success">
                    ✓ Rendez-vous confirmé avec succès !
                    <br>
                    Vous pouvez le retrouver dans
                    votre espace patient.
                </div>
            `;


            /* Reset formulaire */

            appointmentForm.reset();


            /* Recharger après quelques secondes */

            setTimeout(function() {

                window.location.href =
                    "dashboard.html";

            }, 1500);


        }
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

const appointmentsList =
    document.getElementById(
        "appointmentsList"
    );


if (appointmentsList) {

    const currentUser =
        getCurrentUser();


    /* Vérifier connexion */

    if (!currentUser) {

        window.location.href =
            "connexion.html";

    } else {

        loadDashboard(
            currentUser
        );

    }

}


/* =====================================================
   CHARGER DASHBOARD
===================================================== */

function loadDashboard(user) {


    /* Bienvenue */

    const welcomeUser =
        document.getElementById(
            "welcomeUser"
        );


    if (welcomeUser) {

        welcomeUser.textContent =
            "Bonjour " + user.name + " !";

    }


    /* Profil */

    const profileInformation =
        document.getElementById(
            "profileInformation"
        );


    if (profileInformation) {

        profileInformation.innerHTML = `

            <div class="profile-item">

                <span>
                    Nom complet
                </span>

                <strong>
                    ${user.name}
                </strong>

            </div>


            <div class="profile-item">

                <span>
                    Email
                </span>

                <strong>
                    ${user.email}
                </strong>

            </div>


            <div class="profile-item">

                <span>
                    Téléphone
                </span>

                <strong>
                    ${user.phone}
                </strong>

            </div>

        `;

    }


    /* Rendez-vous */

    const appointments =
        getAppointments();


    const userAppointments =
        appointments.filter(
            appointment =>
                appointment.userId === user.id
        );


    /* Nombre */

    const appointmentCount =
        document.getElementById(
            "appointmentCount"
        );


    if (appointmentCount) {

        appointmentCount.textContent =
            userAppointments.length;

    }


    /* Liste */

    const list =
        document.getElementById(
            "appointmentsList"
        );


    if (!list) {

        return;

    }


    if (userAppointments.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <div>
                    📅
                </div>

                <h3>
                    Aucun rendez-vous
                </h3>

                <p>
                    Vous n'avez pas encore
                    de rendez-vous.
                </p>

                <a
                    href="rendez-vous.html"
                    class="btn-primary"
                >
                    Prendre un rendez-vous
                </a>

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    /* Afficher rendez-vous */

    userAppointments.forEach(
        appointment => {

            const appointmentElement =
                document.createElement(
                    "div"
                );


            appointmentElement.className =
                "appointment-item";


            appointmentElement.innerHTML = `

                <div class="appointment-date">

                    <strong>
                        ${formatDate(
                            appointment.date
                        )}
                    </strong>

                    <span>
                        ${appointment.time}
                    </span>

                </div>


                <div class="appointment-details">

                    <h3>
                        ${appointment.speciality}
                    </h3>

                    <p>
                        ${appointment.doctor}
                    </p>

                    <p>
                        ${appointment.reason || "Aucun motif indiqué"}
                    </p>

                </div>


                <div class="appointment-actions">

                    <span class="status-confirmed">
                        ${appointment.status}
                    </span>

                    <button
                        class="cancel-button"
                        onclick="cancelAppointment(${appointment.id})"
                    >
                        Annuler
                    </button>

                </div>

            `;


            list.appendChild(
                appointmentElement
            );

        }
    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =====================================================
   ANNULER RENDEZ-VOUS
===================================================== */

function cancelAppointment(id) {


    const confirmation =
        confirm(
            "Voulez-vous vraiment annuler ce rendez-vous ?"
        );


    if (!confirmation) {

        return;

    }


    let appointments =
        getAppointments();


    appointments =
        appointments.filter(
            appointment =>
                appointment.id !== id
        );


    saveAppointments(
        appointments
    );


    /* Recharger dashboard */

    const currentUser =
        getCurrentUser();


    if (currentUser) {

        loadDashboard(
            currentUser
        );

    }

}


/* =====================================================
   DÉCONNEXION
===================================================== */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "currentUser"
            );


            window.location.href =
                "index.html";

        }
    );

}