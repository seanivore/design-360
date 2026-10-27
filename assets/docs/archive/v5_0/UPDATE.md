+ Update in the works includes
  - Subdomain policy confirmation
  - Research regarding auth for Vercel-project provided dev env custom domains vs. dev.custom-domains 
  - Homepage updates moving away from full on freelance vibe to all purpose 
  - List of things to address from resume prep agent discoveries
  - New project creation completion for illustration and video DAO work `assets/drafts/WRITTEN_PHASE/BRANDING_DIGITAL_ILLUSTRATION.md`
  - New project creation for a CKHeals LLC relationship overview case study (All materials to create a FULL CASE STUDY for CKHeals LLC are now in RIJ project directory, including old social graphic I designed for paid Facebook ads and organic Instagram posts.)
  - Transition of GitHub Pages projects to our new infrastructure (possibly, look at pros and cons)
  - Transition subdomain projects to apex+path URLs; sensible serving in portfolio, minimize DNS record count
+ Re: project access from homepage as part of update
  - Let's make sure not just projects are easily accessible from front page via PHASE A, B, C, but also via skill/trade specific buttons like GRAPHIC DESIGN
  - Consider the tile presentation after clicking through.. Is it clear and clickable enough? Or should it transition to a more portfolio-centric section page vibe with big project thumbnail backed square tiles, a shadow layer, then white simple, concise text for things like: MOTION DESIGN, PETA SOCIAL ADVOCACY, SILENT LABS DAO, CKHEALS LLC, PASSION PROJECTS here is a collection of some, NFT STUDY, ART HISTORY STUDY IN AI GENERATIVE, FASHION STUDY IN AI GENERATIVE, "SPECULATIVE DESIGN" here is a sample of some
  - OR perhaps that just described the homepage component section we need to create, along with the type of projects we need to identify to figure out what part of those entry values can serve as the needed UI frontend
+ Re: prototype access from homepage as part of update
  - Would be good to have this similar visually to the above, but with details below each because they click through directly to a hands-on prototype
  - New project creation directly to frontend of site URL post `https://shop-admin.august.style/store`

---

# Update

## Question

**Priority**: I need to remove the "I'm specifically a contractor" vibe. I don't want to be turning off hiring managers for full or part time positions. I think this can be done without contractor opportunities being turned off. 

This turns away from the heavy "replicate a SaaS landing page" focus that went into the most recent portfolio update, and back towards an easy-to-access project organization. I also think this can be done without completely removing the narrative flow; right now the homepage is rather repetitive on the "three focuses" but doesn't really directly highlight what actual work projects are.

**Priority**: I need to update my narrative so that it reconciles the separation between my solid marketing experience and my user-design focused development projects which have much less solid experience, but have just started to include hands-on prototypes and video walkthroughs.

Considerations: 

  1. The outside perspective on my work and trajectory has always held a "needs focus" feeling that I've struggled to make a solid decision about.
  2. As my desperation for a job and income has increased I've been seriously considering local positions at print factories and UPS delivery roles that pay $26 an hour; this must be factored into the compensation rates I'm open to.
  3. I recognize that my greatest career success within an organization has been when in deep collaboration and mentorship. This triggered searches for apprenticeships where I very quickly found listings of official registered apprenticeships recognized by the Department of Labor (DOL). Initially I thought I might have to be open to blue collar work but I found tech job postings with companies like IBM. These seem to all pay better, some fairly well, and some say that they offer coaching until a job is found after the programs.
  4. Simultaneously I'm reading about mid-level managers leaving tech jobs to re-skill themselves because of corporations integrating AI poorly creating unpleasant work environments, leaning to AI-native individual contributors: `newsletter.pragmaticengineer.com/p/the-great-engineering-leader-career-break`

## Solution

This reads like a convergence opportunity for me to make that decision I've struggled with while accepting that I need a step up or alternative point of entry to get in the door to the labor market again.

I re-skilled to learn how to apply AI to my skill set. 

Significantly, I did walk away from my continuing education having learned how to automate and scale up production of social media and digital marketing content production, and found places to integrate novel strategy that shaped the quality and resonance of my work.

More significantly, my independent curiosity-directed reskilling very naturally continued deeper. My prior non-technical web design morphed into complete production of HTML/CSS/JS websites and Python tools. My love for creating translated directly into building digital products. My experience prompting and need for high-level perspectives led to necessary understanding of larger infrastructures, the services and platforms. My need for controlling details led me into a holistic introduction of tools and concepts.

I started to see that my design background could take me much deeper into the more technical side of production. I discovered I was a strong system thinker and that I could apply logic to optimize flow of data almost as well as I could visually inform and control the user. As the technology evolved my love for creating process accelerated my development ability. At the same time, as a creative problem solving innovator, I recognized that many of the old programming processes didn't make sense for today's tools, and I could update the old processes to avoid spots that held up AI-driven development

It was independent, curiosity-directed continuing education that ended up illustrating how much deeper my 
me into 

 system thinker, applying logic, optimizing flow, love for creating process
curiosity directed personal
A clear long-term goal of working in user design  focused developer

User-design focused AI-native individual contributor full-stack developer.

### **HOMEPAGE UPDATE**

Narrative spine, spine sections should take up only one full viewport, 100 VH x 100 VW, just like the first video hero section does. This should be true on desktop and mobile, though mobile may use a truncated version of the description text. The three spine div may be laid out as columns or rows, if the rows are too tight on desktop; presumably rows make the most sense on mobile. 

PHASE A: Work experience *foundations*.
PHASE B: Re-Skilling with generative AI and automation.
PHASE C: Today's custom AI solutions.

---

## Subdomain Policy

Confirm this first part is complete, then research regarding the second point about auth. It then explains why this is important and provides the start of another task we need to address regarding that subdomain DNS count note. 

**Vercel dev branch clarification**: Research make clear in the `~/.agents/` protocol documents, particularly `GIT_AND_DEPLOY.md`, what exactly the extent of the capabilities are when using the project's auto-provided vercel.ai dev env permalink. The document previously *inaccurately* stated that a staging `dev.<project>.august.style` subdomain was necessary and would eliminate the need to turn the SSO off. This is *NOT* true and has been updated to reflect this truth. We still would need the SSO off, which can be done using the Vercel CLI by the agent when setting everything up, and can be left off until the end of the project. The allows webhooks, etc. to work, and in previous projects such as building an online store using Stripe, the provided URL from Vercel did work. This is what they usually look like but, they are produced when launching the dev env and are not changed after that Vercel project creation point: `everlastings-git-dev-seanivore.vercel.app/`. We were able to fully test with SSO webhooks, agentically drive Claude-In-Chrome validations, use dev tools in Chrome, API endpoints, and Stripe, all worked. We just had to set up some of those items, like the test webhooks, using the `...vercel.app` URL.

The remaining uncertainty that has not been relevant until working on the `~/Development/rooted-joy/` and `~/Development/thot-app/` projects, is regarding **passkeys/WebAuthn RP ID, cookie-domain auth, same-registrable CORS**. Logically, it would seem that because setting up these service utilities for production would require entering the production URL somewhere, and if the alternative was to create a secondary staging dev subdomain at my primary apex domain, then there should be no reason that the `...vercel.app` provided Vercel-project's custom permalink for the dev env would also be set up in the same way, as long as SSO is off. If this is not the case after research, I'd like to understand why the logic doesn't fit, because being able to turn the SSO on when finished seems like it would even make using `...vercel.app` project dev env permalink even more secure by default. 

Either way, we need to figure this out as we roll out the first builds of the RIJ and THOT project, and then as those projects expand to require user logins beyond just the admin logins. This is also the case for the `~/Development/contract-payments/` project, as it will require creating new auth setup for each new client being onboarded. 

Why is this important? Because Cloudflare's free tier only allows a limited number of DNS records. As more and more project have required setting up email subdomains through Resend, we've been blowing through them, so every one we can save counts. 

In light of that, I would also like to go through a list of "seanivore.github.io" hosted projects, update them with our new infrastructure, and then hopefully have them live at actual `august.style/<project>/<project-prototype>/` URLs instead of creating subdomains. The same would be the case for Vercel projects living at subdomains that could preferably live at an apex URL with a path instead. Then we can reserve subdomains only for the most important current projects and any public facing project used by clients or subscribers.