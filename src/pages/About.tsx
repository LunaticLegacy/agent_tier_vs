import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AboutHero from '@/components/about/AboutHero'
import ProcessSteps from '@/components/about/ProcessSteps'
import DimensionAccordion from '@/components/about/DimensionAccordion'
import RankingStandards from '@/components/about/RankingStandards'
import TierTable from '@/components/about/TierTable'
import ProductTierTable from '@/components/about/ProductTierTable'
import Principles from '@/components/about/Principles'

function AboutCta() {
  return (
    <section className="container-site border-t border-line py-20 text-center md:py-28">
      <motion.p
        className="font-mono text-sm text-ink-dim"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        评审完成度 <span className="text-tier-c">17/17 ✓</span>
      </motion.p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        >
          <Link
            to="/"
            className="inline-block bg-vs px-8 py-4 font-bold text-[#0A0B0E] transition-transform hover:scale-[1.03]"
            data-cursor="link"
          >
            查看 Tier 总榜 →
          </Link>
        </motion.div>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
        >
          <Link
            to="/wiki"
            className="inline-block border border-line-bright px-8 py-4 font-bold text-ink transition-colors hover:border-vs hover:text-vs"
            data-cursor="link"
          >
            浏览 Wiki 档案
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <AboutHero />
      <ProcessSteps />
      <DimensionAccordion />
      <RankingStandards />
      <TierTable />
      <ProductTierTable />
      <Principles />
      <AboutCta />
    </>
  )
}
