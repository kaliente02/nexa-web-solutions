import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const cards = [
  {
    number: '01',
    title: 'Services',
    description:
      'Websites, web applications, business systems, AI automation, and custom software.',
    link: '/docs/services/websites',
  },
  {
    number: '02',
    title: 'Solutions',
    description:
      'CRM, booking, inventory, analytics, and operational systems for modern businesses.',
    link: '/docs/solutions/crm',
  },
  {
    number: '03',
    title: 'Products',
    description:
      'Explore NEXA products and the NEXA Core platform concept.',
    link: '/docs/products/overview',
  },
  {
    number: '04',
    title: 'Development',
    description:
      'Architecture, frontend, backend, databases, APIs, and AI integrations.',
    link: '/docs/development/architecture',
  },
  {
    number: '05',
    title: 'Deployment',
    description:
      'Local development, production deployment, security, and operational practices.',
    link: '/docs/deployment/local-development',
  },
  {
    number: '06',
    title: 'Guides',
    description:
      'Practical guides for developing and integrating NEXA systems.',
    link: '/docs/guides/getting-started',
  },
];

export default function Home() {
  return (
    <Layout
      title="Documentation"
      description="NEXA documentation for digital systems, software, and AI automation."
    >
      <main className={styles.main}>

        {/* HERO */}

        <section className={styles.hero}>
          <div className={styles.heroInner}>

            <div className={styles.badge}>
              FOUNDER-LED
              <span>·</span>
              DEMO-FIRST
              <span>·</span>
              REMOTE-FRIENDLY
            </div>

            <Heading as="h1">
              Digital Systems
              <br />
              <span>Built for Growth.</span>
            </Heading>

            <p className={styles.heroText}>
              NEXA builds websites, web applications, business systems,
              and AI-powered automation that help businesses operate
              better and grow faster.
            </p>

            <div className={styles.actions}>
              <Link
                className={styles.primaryButton}
                to="/docs/intro"
              >
                Explore Documentation
                <span>→</span>
              </Link>

              <a
                className={styles.secondaryButton}
                href="https://nexa-web.site"
              >
                Visit NEXA
              </a>
            </div>

          </div>
        </section>

        {/* DOCUMENTATION */}

        <section className={styles.documentation}>

          <div className={styles.sectionHeader}>
            <div className={styles.sectionNumber}>01</div>

            <div>
              <Heading as="h2">
                Documentation
              </Heading>

              <p>
                Everything you need to understand, build,
                deploy, and operate NEXA digital systems.
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span>{card.number}</span>
                  <span className={styles.cardArrow}>↗</span>
                </div>

                <h3>{card.title}</h3>

                <p>
                  {card.description}
                </p>

                <div className={styles.cardLink}>
                  Explore
                </div>
              </Link>
            ))}
          </div>

        </section>

        {/* PHILOSOPHY */}

        <section className={styles.philosophy}>

          <div className={styles.philosophyLabel}>
            02 · NEXA PHILOSOPHY
          </div>

          <div className={styles.philosophyContent}>

            <Heading as="h2">
              Your business doesn't always
              need another website.
              <br />
              <span>Sometimes it needs a system.</span>
            </Heading>

            <p>
              NEXA focuses on building practical digital
              infrastructure that solves real operational
              problems.
            </p>

          </div>

        </section>

        {/* PROCESS */}

        <section className={styles.process}>

          <div className={styles.sectionHeader}>
            <div className={styles.sectionNumber}>03</div>

            <div>
              <Heading as="h2">
                The NEXA Process
              </Heading>

              <p>
                From idea to production, every project
                follows a clear development path.
              </p>
            </div>
          </div>

          <div className={styles.processFlow}>

            {[
              'Discover',
              'Plan',
              'Prototype',
              'Demo',
              'Build',
              'Deploy',
            ].map((step, index) => (
              <div
                className={styles.processStep}
                key={step}
              >
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <strong>
                  {step}
                </strong>
              </div>
            ))}

          </div>

        </section>

        {/* CTA */}

        <section className={styles.cta}>

          <div>
            <span>NEXA DOCUMENTATION</span>

            <Heading as="h2">
              Build better systems.
            </Heading>

            <p>
              Explore the documentation and discover
              how NEXA approaches digital systems.
            </p>
          </div>

          <Link
            className={styles.primaryButton}
            to="/docs/intro"
          >
            Get Started
            <span>→</span>
          </Link>

        </section>

      </main>
    </Layout>
  );
}