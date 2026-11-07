/** Bricks brand rule: sharp square edges on every element of the review page (cards, buttons, inputs, badges, chat). */
export default function SupportReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{'html,body,body *,body *::before,body *::after{border-radius:0 !important}'}</style>
      {children}
    </>
  )
}
