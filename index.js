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
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true
});

gotoSection(0, 1);

function handleSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('herbalifeForm');
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  console.log(JSON.stringify(data));

  fetch('https://script.google.com/macros/s/AKfycbyoLtLKVfJUAf9GrAkj-PZwPO6KMMGSx4iPloZGP263nj0Hv5Y73d-oYtkYhwBBZqSG/exec', {
    method: 'POST',
    mode: 'no-cors', // This is important to avoid CORS issues
    redirect: 'follow',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(response => console.log('Success!', response))
  .catch(error => console.error('Error!', error.message));
}
