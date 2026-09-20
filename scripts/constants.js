/**
 * Single source of truth for site configuration constants. Loaded before
 * shared.js on every page; edit identities, endpoints, and display data here.
 */

/**
 * GitHub username used across repo API calls and profile links.
 */
const GITHUB_USERNAME = 'ujjuboi';

/**
 * LeetCode username used across stats API calls and profile links.
 */
const LEETCODE_USERNAME = 'ujjuboi';

/**
 * Email address shown in the site footer.
 */
const EMAIL_ADDRESS = 'ujjwalv99@protonmail.com';

/**
 * LinkedIn username used to build the profile URL.
 */
const LINKEDIN_USERNAME = 'ujjwal-verma99';

/**
 * Base URL for the GitHub REST API.
 */
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Base URL for raw GitHub content (banners resolved from READMEs).
 */
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

/**
 * Base URL for the LeetCode stats API.
 */
const LEETCODE_STATS_BASE = 'https://leetcode-stats.tashif.codes/' + LEETCODE_USERNAME;

/**
 * Endpoint returning the LeetCode submission heatmap.
 */
const LEETCODE_HEATMAP_URL = LEETCODE_STATS_BASE + '/heatmap';

/**
 * Endpoint returning recent LeetCode submissions.
 */
const LEETCODE_SUBMISSIONS_URL = 'https://leetpulse-api.vercel.app/api/leetcode/submission/' + LEETCODE_USERNAME + '?limit=5';

/**
 * Public LeetCode profile URL.
 */
const LEETCODE_PROFILE_URL = 'https://leetcode.com/' + LEETCODE_USERNAME + '/';

/**
 * Base URL for individual LeetCode problem pages.
 */
const LEETCODE_PROBLEM_BASE = 'https://leetcode.com/problems/';

/**
 * Candidate repos for the "Currently Working On" section.
 * The first repo that loads successfully is displayed.
 */
const CURRENT_PROJECT_REPOS = ['ujjuboi/jobhunt'];

/**
 * How many trailing months of commit/issue activity the chart shows.
 */
const COMMIT_CHART_MONTHS = 6;

/**
 * Cache TTL (6 hours) for external API responses.
 */
const CACHE_TTL = 6 * 60 * 60 * 1000;

/**
 * Max result pages walked for GitHub commit and issue histories.
 */
const MAX_GITHUB_PAGES = 5;

/**
 * Blog post categories, shown as collapsible sections in order.
 */
const BLOG_CATEGORIES = ['Deloitte', 'Personal Projects', 'Research'];

/**
 * Resume sections, shown as collapsible blocks in order.
 */
const RESUME_CATEGORIES = ['Professional Summary', 'Work Experience', 'Projects', 'Education', 'Skills'];

/**
 * MySpace sections, shown as collapsible blocks in order.
 * The first section starts expanded; the rest start collapsed.
 */
const MYSPACE_CATEGORIES = ['Currently Studying', 'Currently Working On', 'LeetCode Progress', 'My Library'];

/**
 * Month names used for chart axis and tooltip labels.
 */
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Month lookup used to build sortable keys from "Month YYYY" dates.
 */
const SORT_MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

/**
 * Font themes selectable in the switcher, keyed by the data attribute value.
 */
const FONT_THEMES = ['default', 'sans', 'ebook', 'scholarly'];

/**
 * Profile headlines shown in the scrolling profile strip.
 */
const PROFILES = [
  'Full Stack Developer',
  'AI Developer',
  'Forward Deployed Engineer',
  'DevSecOps Engineer',
  'IAM/PAM Analyst'
];

/**
 * Tooltip copy shown when hovering each profile headline.
 */
const PROFILE_INFO = {
  'Full Stack Developer': 'I\u2019ve spent 4+ years building enterprise-scale applications end-to-end \u2014 Next.js, ExpressJS, and SpringBoot backed by MongoDB and Redis, from API-heavy features to data analytics platforms like DDPX.',
  'AI Developer': 'I\u2019ve built AI agents and workflows in production \u2014 autonomous GitHub agentic workflows that review PRs and update docs, LangChain high/low-code agents, and an NLTK/Spacy agent that identifies owners of IAM principals.',
  'Forward Deployed Engineer': 'I\u2019ve delivered directly on client engagements \u2014 turning identity-data requirements into shipped features, scaling bulk imports from 100K to 400K records and ingestion to 1,500 records/sec, and analyzing 100,000+ records across domains.',
  'DevSecOps Engineer': 'I\u2019ve automated PR-triggered CI/CD on GitHub Actions with secure guardrails \u2014 review, lint, documentation, testing, and quality-gate checks that run automatically before data reaches production.',
  'IAM/PAM Analyst': 'I\u2019ve worked hands-on across identity and access management \u2014 designing RBAC in Java, setting up SAML SSO with Okta and AWS Cognito, mapping SailPoint/Okta/PingFederate data, and building analytics for orphan groups and privileged entitlements with 95% ownership accuracy.'
};

/**
 * Maps long section/role labels to short folder names.
 */
const SHORT_NAMES = {
  'Software Engineer 2 - DI App Factory': 'swe-2',
  'Software Engineer 1 - DI App Factory': 'swe-1',
  'Associate Software Developer - DI App Factory': 'asoc-dev-sc',
  'Associate Software Developer - DDPX': 'asoc-dev-ddpx',
  'Risk & Financial Advisory Analyst - DDPX': 'iam-risk-analyst',
  'Frontend/Backend': 'frontend',
  'Languages/Tools': 'languages',
  'Databases': 'databases',
  'Cloud/AI': 'cloud',
  'Infrastructure': 'infra'
};

/**
 * Icon shown for directory tree files.
 */
const ICON_SRC = '../../Images/information-svgrepo-com.svg';

/**
 * Back arrow SVG shown in place of the hamburger icon while the drawer is open.
 */
const MENU_ARROW_ICON = '<svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11h24M13 3L4 11l9 8" style="stroke: var(--shadowColor)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * True when tap-based `.tapped` feedback should replace `:hover` styling:
 * the device reports touch capability AND fits the mobile breakpoint, which
 * matches the `@media (max-width: 720px)` touch rules in the stylesheets.
 */
const IS_TOUCH_TAP = (('ontouchstart' in window) || navigator.maxTouchPoints > 0) &&
  window.matchMedia('(max-width: 720px)').matches;

/**
 * Elements whose underline (or tooltip popover) should persist while tapped,
 * clearing only when another persistent element or empty space receives the
 * next tap.
 */
const TAPPED_PERSISTENT_SELECTOR = [
  '.profiles-item',
  '.card-link',
  '.lc-submission-title',
  '.resume-contact a',
  '.editor-link',
  '.editor-preview a'
].join(',');

/**
 * Elements whose hover reaction should flash only while the finger is down,
 * never lingering on screen after the tap ends.
 */
const TAPPED_MOMENTARY_SELECTOR = [
  '.card',
  '.section-heading.collapsible',
  '#back-btn',
  '#book-back-btn',
  '#study-plan-back-btn',
  '.skill-item',
  '.commit-point',
  '.lc-bar',
  '.lc-submission',
  '.book-card',
  '.is-clickable',
  '.drawer-item-sub',
  '.launch-btn',
  '.banner-links a',
  '.directory-toggle',
  '.directory-back',
  '.directory-file',
  '.directory-folder-header',
  '.editor-dot-back',
  '.mode-btn',
  '.editor-tab',
  '.editor-read-more',
  '#font-switcher-menu button',
  'footer #footer_nav a',
  '.profiles-strip',
  '#signature'
].join(',');

/**
 * Social links rendered in the shared site footer, mirroring the
 * banner-links block found on the Professional page.
 */
const FOOTER_LINKS = [
  { label: 'Email', href: 'mailto:' + EMAIL_ADDRESS, svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" d="M32.8359 4.28906H3.16406C1.42158 4.28906 0 5.70909 0 7.45312V28.5469C0 30.285 1.41525 31.7109 3.16406 31.7109H32.8359C34.5741 31.7109 36 30.2957 36 28.5469V7.45312C36 5.715 34.5847 4.28906 32.8359 4.28906ZM32.399 6.39844L18.0671 20.7304L3.61118 6.39844H32.399ZM2.10938 28.1101V7.87985L12.2681 17.9514L2.10938 28.1101ZM3.60091 29.6016L13.766 19.4365L17.3278 22.9677C17.7401 23.3765 18.4055 23.3752 18.8161 22.9645L22.2891 19.4915L32.3991 29.6016H3.60091ZM33.8906 28.11L23.7806 18L33.8906 7.88991V28.11Z"/></svg>' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/' + LINKEDIN_USERNAME + '/', svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" d="M11.2505 29.7422H6.32867V13.8516H11.2505V29.7422ZM11.7416 8.78879C11.7416 7.19769 10.4507 5.90625 8.86047 5.90625C7.26416 5.90625 5.97656 7.19769 5.97656 8.78879C5.97656 10.3804 7.26416 11.6719 8.86047 11.6719C10.4507 11.6719 11.7416 10.3804 11.7416 8.78879ZM29.6719 20.9998C29.6719 16.7341 28.7707 13.5703 23.7876 13.5703C21.3931 13.5703 19.7858 14.7678 19.1297 16.0131H19.125V13.8516H14.3438V29.7422H19.125V21.8524C19.125 19.7861 19.651 17.7844 22.2122 17.7844C24.7385 17.7844 24.8203 20.1473 24.8203 21.9836V29.7422H29.6719V20.9998ZM36 31.7812V4.21875C36 1.8924 34.1076 0 31.7812 0H4.21875C1.8924 0 0 1.8924 0 4.21875V31.7812C0 34.1076 1.8924 36 4.21875 36H31.7812C34.1076 36 36 34.1076 36 31.7812V31.7812ZM31.7812 2.8125C32.5566 2.8125 33.1875 3.44339 33.1875 4.21875V31.7812C33.1875 32.5566 32.5566 33.1875 31.7812 33.1875H4.21875C3.44339 33.1875 2.8125 32.5566 2.8125 31.7812V4.21875C2.8125 3.44339 3.44339 2.8125 4.21875 2.8125H31.7812Z"/></svg>' },
  { label: 'GitHub', href: 'https://github.com/' + GITHUB_USERNAME, svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" d="M18 0C8.10709 0 0 8.1774 0 18.0703C0 27.9058 8.0332 36 18 36C27.9544 36 36 27.9179 36 18.0703C36 8.1774 27.8929 0 18 0ZM21.1641 33.5742C20.1517 33.7852 19.0758 33.8906 18 33.8906C16.9242 33.8906 15.8483 33.7852 14.8359 33.5742V28.6383C14.8359 27.457 15.1523 27.0352 15.5742 26.4655C15.789 26.22 15.9186 25.9997 16.8819 24.5462L15.2578 24.293C11.0811 23.6813 9.43588 21.5085 8.78192 19.821C7.93817 17.5641 8.3812 14.7373 9.90005 12.9446C10.1321 12.6703 10.3219 12.2061 10.1533 11.721C9.83661 10.7507 9.87891 9.21094 10.0898 8.62015C11.2083 8.78 12.3582 9.58118 13.3174 10.1602C13.7593 10.4181 13.9911 10.3499 14.2031 10.3711C14.9738 10.2107 16.176 9.8226 18.0211 9.8226C19.1602 9.8226 20.3626 9.99124 21.5439 10.3288C21.7551 10.3239 22.0946 10.5035 22.6829 10.1602C23.6854 9.54932 24.7964 8.7756 25.9102 8.62015C26.1211 9.21094 26.1634 10.7507 25.847 11.721C25.6781 12.2061 25.8679 12.6703 26.1002 12.9446C27.6188 14.7376 28.0618 17.5641 27.2181 19.821C26.5641 21.5085 24.9189 23.6813 20.7422 24.293L19.1181 24.5462C20.1138 26.0486 20.2187 26.2288 20.4261 26.4655C20.8477 27.0352 21.1641 27.457 21.1641 28.6383V33.5742ZM23.2734 32.9626V28.6383C23.2734 27.4359 23.0202 26.6344 22.6826 26.0436C25.889 25.179 28.1673 23.2803 29.1797 20.5593C30.2555 17.6907 29.7705 14.2734 27.9772 11.9108C28.2939 10.4977 28.2939 8.24057 27.5345 7.18588C27.1969 6.72198 26.7328 6.46875 26.1422 6.46875C26.1211 6.46875 26.1211 6.46875 26.1211 6.46875C24.4855 6.55719 23.1982 7.38089 21.818 8.21942C20.5524 7.88187 19.2656 7.71323 17.9789 7.71323C16.6712 7.71323 15.3633 7.90302 14.2034 8.21942C12.7505 7.34326 11.4755 6.55499 9.79459 6.46875C9.26724 6.46875 8.80307 6.72198 8.46552 7.18588C7.70636 8.24057 7.70636 10.4977 8.02277 11.9108C6.22952 14.2734 5.74448 17.7116 6.82031 20.5593C7.8327 23.2803 10.111 25.179 13.3174 26.0436C13.0556 26.5015 12.8485 27.0923 12.7669 27.8918C12.1193 28.1151 11.5576 28.1879 11.0352 28.0344C10.4843 27.8715 10.055 27.5037 9.68198 26.8764C8.84427 25.4691 7.41742 24.3202 5.79282 24.4696L5.97821 26.5707C6.7305 26.5018 7.47922 27.2977 7.86813 27.9539C8.50974 29.0344 9.37408 29.743 10.4378 30.0572C11.2275 30.2899 11.9493 30.2844 12.7266 30.1185V32.9626C6.58823 30.8109 2.10938 24.9469 2.10938 18.0703C2.10938 9.33755 9.26724 2.10938 18 2.10938C26.7328 2.10938 33.8906 9.33755 33.8906 18.0703C33.8906 24.9469 29.4118 30.8109 23.2734 32.9626Z"/></svg>' },
  { label: 'LeetCode', href: LEETCODE_PROFILE_URL, svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" transform="translate(-3.43 0) scale(1.3393 1.125)" d="M21.469 23.907l-3.595 3.473c-0.624 0.625-1.484 0.885-2.432 0.885s-1.807-0.26-2.432-0.885l-5.776-5.812c-0.62-0.625-0.937-1.537-0.937-2.485 0-0.952 0.317-1.812 0.937-2.432l5.76-5.844c0.62-0.619 1.5-0.859 2.448-0.859s1.808 0.26 2.432 0.885l3.595 3.473c0.687 0.688 1.823 0.663 2.536-0.052 0.708-0.713 0.735-1.848 0.047-2.536l-3.473-3.511c-0.901-0.891-2.032-1.505-3.261-1.787l3.287-3.333c0.688-0.687 0.667-1.823-0.047-2.536s-1.849-0.735-2.536-0.052l-13.469 13.469c-1.307 1.312-1.989 3.113-1.989 5.113 0 1.996 0.683 3.86 1.989 5.168l5.797 5.812c1.307 1.307 3.115 1.937 5.115 1.937 1.995 0 3.801-0.683 5.109-1.989l3.479-3.521c0.688-0.683 0.661-1.817-0.052-2.531s-1.849-0.74-2.531-0.052zM27.749 17.349h-13.531c-0.932 0-1.692 0.801-1.692 1.791 0 0.991 0.76 1.797 1.692 1.797h13.531c0.933 0 1.693-0.807 1.693-1.797 0-0.989-0.76-1.791-1.693-1.791z"/></svg>' }
];