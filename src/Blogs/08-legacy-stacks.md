## Title: Legacy Stacks vs Modern Frameworks

## Date: October 3, 2024

## Excerpt: How my first PHP project — a Rock Paper Scissors game — taught me fundamentals that still shape how I build with Next.js and modern frameworks today.

## Banner: ../../Images/Graphics/php.png

## Category: Research

## Paragraphs

- <p>Let me set the record straight: legacy technologies aren't dead. In fact, they power a massive portion of the web that most modern framework evangelists forget exists. My early development work with PHP through a beginner project — a Rock Paper Scissors game with login functionality — taught me things that no React tutorial ever could.</p>
- <p>The Rock-Paper-Scissors-PHP project on my GitHub was my first foray into PHP, and it was surprisingly formative. I built a game where users set a password, log in with a custom username, and play against the computer. The computer's move was generated using PHP's built-in rand() function, while passwords were hashed using md5() — I deliberately chose md5 over password_hash to understand the algorithm and practice decryption techniques. The project followed a basic Model-View-Control (MVC) pattern to keep the code organized, and it ran on a simple PHP server with HTML and CSS for the frontend.</p>
- <p>Working with PHP gave me a deep understanding of the request-response lifecycle, server-side rendering, and the fundamentals of web architecture. Before I ever touched a React component or Next.js hook, I knew how HTTP actually works, how sessions are managed via cookies and server state, and how data flows from file to database to browser. I understood what it meant for a server to receive a POST request, execute logic, and render a response — concepts that aren't always obvious when you're working inside SPA abstractions.</p>
- <p>Transitioning to modern frameworks like Next.js and Django felt like leveling up, but it wasn't a replacement — it was an evolution. Understanding the old way made learning the new way intuitive. When I use Server-Side Rendering in Next.js, I understand the exact problems in the PHP era that led to its creation. When I work with API routes or middleware, I can trace their lineage back to the early PHP routers and preprocessors that inspired them.</p>
- <p>The key insight: don't romanticize legacy code or dismiss it. Respect what it achieved with limited tools, and apply that same practical thinking to your modern stack. The best engineers I know write modern code with the wisdom of systems that survived the pre-cloud era.</p>
- <p>That said, I do miss the simplicity of a well-crafted PHP script served from a single file. Sometimes the answer is just... a file. Or is it? (Still debating this one.)</p>
