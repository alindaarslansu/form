gsap.registerPlugin(Observer);
gsap.registerPlugin(TextPlugin);

let isAnimated = false;
let lastSectionReached = false;

function animateForm() {
    if (isAnimated) return;
    isAnimated = true;
    // remove hidden class
    document.getElementsByClassName("form-input-group")[0].removeAttribute("hidden");
    gsap.from(".form-input-group", {
        duration: 3,
        y: -160,
        opacity: 0,
        stagger: 1,
        ease: "power1.out"
    });
}

function animateSection(sectionIndex) {
    if (sectionIndex === 4) { // If it's the fifth section
        console.log("animating form");
        lastSectionReached = true;
    } else {
        // Randomly choose an animation
        if (Math.random() < 0.3) {
            // Original animation to "↓ ↓ ↓"
            gsap.to(headings[sectionIndex], {
                duration: 1,
                text: "↓ ↓ ↓",
                ease: "power2.out",
                stagger: 0.3
            });
        } else {
            // New subtle and professional animation ending with "↓ ↓ ↓"
            gsap.to(headings[sectionIndex], {
                duration: 0.6,
                opacity: 0,
                y: 20,
                ease: "power2.in",
                onComplete: () => {
                    gsap.fromTo(headings[sectionIndex], {
                        text: "",
                        opacity: 0,
                        y: -20
                    }, {
                        duration: 1,
                        text: "↓ ↓ ↓",
                        opacity: 1,
                        y: 0,
                        ease: "power2.out",
                        stagger: 0.05
                    });
                }
            });
        }
    }
}



let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

gsap.set(outerWrappers, {yPercent: 100});
gsap.set(innerWrappers, {yPercent: -100});

function gotoSection(index, direction) {
    index = wrap(index); // make sure it's valid
    animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
            defaults: {duration: 1.25, ease: "power1.inOut"},
            onComplete: () => {
                animating = false;
                if (index === 4) { // Check if it's the fifth section
                    animateForm(); // Animate the form immediately
                }
                setTimeout(() => {
                    animateSection(index); // Call the animation function for the current section
                }, 2000);
            }
        });

    if (currentIndex >= 0) {
        // The first time this function runs, current is -1
        gsap.set(sections[currentIndex], {zIndex: 0});
        tl.to(images[currentIndex], {yPercent: -15 * dFactor})
            .set(sections[currentIndex], {autoAlpha: 0});
    }
    gsap.set(sections[index], {autoAlpha: 1, zIndex: 1});
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
    }, {
        yPercent: 0
    }, 0)
        .fromTo(images[index], {yPercent: 15 * dFactor}, {yPercent: 0}, 0)
        .fromTo(headings[index], {
            autoAlpha: 0,
            y: 50 * dFactor
        }, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power2"
        }, 0.2);

    currentIndex = index;
}

Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && !lastSectionReached && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && !lastSectionReached && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true
});


gotoSection(0, 1);

function toggleFormPart() {
    const part1 = document.querySelector('.form-part-1');
    const part2 = document.querySelector('.form-part-2');

    // Animate the first part out
    gsap.to(part1, {
        duration: 0.5,
        opacity: 0,
        y: -50,
        onComplete: () => {
            part1.setAttribute('hidden', true);

            // Reset part1's style for when it's shown again
            gsap.set(part1, { opacity: 1, y: 0 });

            // Show and animate the second part in
            part2.removeAttribute('hidden');
            gsap.from(part2, {
                duration: 0.5,
                opacity: 0,
                y: 50
            });
        }
    });
}

function showLoadingIndicator(show) {
    const spinner = document.querySelector('.loading-spinner');
    if (show) {
        spinner.removeAttribute('hidden');
    } else {
        spinner.setAttribute('hidden', 'true');
    }
}


function animateFormSuccess() {
    console.log("animate success is called");
    const formSection = document.querySelector('.fifth');
    const formContent = formSection.querySelector('.bg'); // Assuming .bg contains the form elements
    const outerElement = formSection.querySelector('.outer'); // Select the outer element
    const checkMark = document.createElement('div');
    checkMark.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 448 512" style="fill: #14db3c;"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
    checkMark.classList.add('check-mark');

    // Animate form content out
    gsap.to(formContent, {
        duration: 1.5,
        opacity: 0,
        scale: 0.5,
        onComplete: () => {
            // Clear the form content
            formContent.innerHTML = '';
            outerElement.style.display = 'none';
            // Append the checkmark to the form section, not the form content
            formSection.appendChild(checkMark);
            formSection.style.display = 'flex';
            formSection.style.justifyContent = 'center';
            formSection.style.alignItems = 'center';

            // Animate checkmark in
            gsap.fromTo(checkMark, {
                scale: 0,
                opacity: 0
            }, {
                duration: 1.5,
                scale: 1,
                opacity: 1,
                ease: 'bounce.out'
            });
        }
    });
}

function onCaptchaSuccess() {
    document.querySelector('.g-recaptcha').style.display = 'none';
}


function handleSubmit(event) {
    event.preventDefault();

    const recaptchaResponse = grecaptcha.getResponse();
    if(recaptchaResponse.length === 0) {
        // CAPTCHA not completed and request not timed out
        alert("Please complete the CAPTCHA");
        return; // Stop the form submission
    }

    const form = document.getElementById('herbalifeForm');
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        data[checkbox.name] = checkbox.checked;
    });

    // Show loading indicator
    showLoadingIndicator(true);

    fetch('https://script.google.com/macros/s/AKfycbyoLtLKVfJUAf9GrAkj-PZwPO6KMMGSx4iPloZGP263nj0Hv5Y73d-oYtkYhwBBZqSG/exec', {
        method: 'POST',
        mode: 'no-cors',
        redirect: 'follow',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(response => {
        showLoadingIndicator(false);

        if (response){
            animateFormSuccess();
        } else {
            console.error("Submission failed");
        }
    })
    .catch(error => {
        console.error('Error!', error.message);
        showLoadingIndicator(false);
    });
}



function goBack() {
    const part1 = document.querySelector('.form-part-1');
    const part2 = document.querySelector('.form-part-2');

    // Animate the second part out
    gsap.to(part2, {
        duration: 0.5,
        opacity: 0,
        y: 50,
        onComplete: () => {
            part2.setAttribute('hidden', true);

            // Reset part2's style for when it's shown again
            gsap.set(part2, { opacity: 1, y: 0 });

            // Show and animate the first part in
            part1.removeAttribute('hidden');
            gsap.from(part1, {
                duration: 0.5,
                opacity: 0,
                y: -50
            });
        }
    });
}

