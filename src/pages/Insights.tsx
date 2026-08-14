import InsightsHero from '@/components/insights/InsightsHero'
import DeterminismRace from '@/components/insights/DeterminismRace'
import SupervisionRadial from '@/components/insights/SupervisionRadial'
import StarsScatter from '@/components/insights/StarsScatter'
import BusFactor from '@/components/insights/BusFactor'
import MethodologyConclusion from '@/components/insights/MethodologyConclusion'

export default function Insights() {
  return (
    <>
      <InsightsHero />
      <DeterminismRace />
      <SupervisionRadial />
      <StarsScatter />
      <BusFactor />
      <MethodologyConclusion />
    </>
  )
}
