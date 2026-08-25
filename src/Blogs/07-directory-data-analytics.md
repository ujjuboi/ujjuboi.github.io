## Title: Directory Data Analytics and Identity Correlation at Scale

## Date: April 18, 2025

## Excerpt: Building visual graph-based analytics to find security vulnerabilities in identity data across Active Directory, AWS IAM, and Microsoft Entra ID.

## Banner: ../../Images/Graphics/ActiveDirectory.svg

## Category: Deloitte

## Paragraphs

- <p>At Deloitte, we worked on DDPX — a large-scale identity data analytics platform that helps enterprises discover security vulnerabilities and governance issues hidden within their identity infrastructure. The tool ingests data from Active Directory, Microsoft Entra ID, AWS IAM, and other identity sources, then surfaces insights like orphan groups, inactive service accounts, and risky permission assignments.</p>
- <p>One of our first major contributions was designing and implementing Role-Based Access Control (RBAC) in Java for the monolithic application. Rather than layering permissions on after the fact, we created a whitelist of APIs and blocked everything else by default, using a multi-tenant handler built in SpringBoot. This principle — deny-then-allow — has since become something we apply to every system we design.</p>
- <p>Data visualization was where the real value emerged for end users. We built visual graph-based analytics using React Flow and ChartJS to map relationships between identities, groups, applications, and entitlements. These visualizations made it possible to spot complex attack paths and misconfigurations that tabular data would never reveal. We also correlated identity sources across platforms, connecting dots between directory users, AWS principals, and cloud identities that lived in siloed systems.</p>
- <p>We implemented integrations with external Identity Providers to make the tool more widely usable — setting up SAML with Okta, OAuth 2.0 flows, AWS Cognito, and Microsoft Azure Graph. Each IdP has its own authentication model and quirks, and learning how they interoperate taught us a lot about the broader identity ecosystem.</p>
- <p>For ownership attribution, we created algorithms that achieved 95% accuracy in identifying rightful owners of privileged entities. The system combined deterministic methods — like direct user-role mappings — with probabilistic approaches powered by LLM inference for edge cases. These algorithms were tested against datasets of 100,000+ records, and the results regularly helped clients uncover vulnerabilities and flag risky identity state that would otherwise go unnoticed.</p>
- <p>We also optimized the data presentation layer significantly. By implementing dynamic routing in Next.js, tuning API payloads, and adding pagination with Bootstrap Table, we reduced data load times by 50%. This wasn't just a technical exercise — it directly improved the speed and usability of analytics workflows that consultants ran against thousands of records.</p>
- <p>The broader lesson from this work is that identity data is rarely just about access control. It's about understanding relationships — between users and groups, between applications and entitlements, between cloud principals and directory accounts. The vulnerabilities organizations face are rarely in any single system; they emerge from the gaps between them. Building tools that connect these dots is where the real impact lies.</p>
