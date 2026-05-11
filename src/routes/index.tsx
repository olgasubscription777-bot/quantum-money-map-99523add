import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Квантовая диагностика денег | Марина Сухинина" },
      { name: "description", content: "Бесплатный тест: узнайте свой финансовый сценарий и корневое убеждение, которое мешает вам зарабатывать." },
      { property: "og:title", content: "Квантовая диагностика денег" },
      { property: "og:description", content: "Узнайте свой финансовый сценарий за 3 минуты." },
    ],
  }),
  component: Index,
});

type Scenario = "rescuer" | "fearful" | "guilty" | "empty" | "growing";

const scenarioMeta: Record<Scenario, {
  name: string;
  tagline: string;
  beliefs: string[];
  quantum: string;
  description: string;
}> = {
  rescuer: {
    name: "Спасатель",
    tagline: "Вы зарабатываете для других",
    beliefs: [
      "Если будет много денег – не будет времени на семью",
      "Жалко тратить деньги на себя",
      "Чем больше денег – тем больше ответственности. А оно мне надо?",
      "Если я буду зарабатывать больше, то перестану быть «своим» для родных и знакомых",
    ],
    quantum: "Когда я считаю, что кто-то должен обо мне позаботиться, есть пространство, где я сам способен позаботиться о себе, и я там.",
    description: "Ваша энергия денег утекает в чужие сценарии. Вы сильны, но забыли, что наполненный сосуд питает мир щедрее пустого.",
  },
  fearful: {
    name: "Хранитель страха",
    tagline: "Вы боитесь больших сумм",
    beliefs: [
      "Иметь много денег – опасно",
      "Большие деньги приносят большие проблемы",
      "Много денег иметь нельзя, могут отобрать",
      "Я боюсь остаться ни с чем, боюсь потерять всё",
      "Чтобы накопить, нужно экономить",
      "Чтобы выжить, мне надо экономить",
    ],
    quantum: "Когда я боюсь остаться без средств к существованию, есть пространство, где я знаю и верю, что всегда буду жить в достатке, и я там.",
    description: "Каждый прилив денег вы встречаете сжатием. Тело запоминает страх и закрывает канал. Пора разрешить себе расширение.",
  },
  guilty: {
    name: "Виновный изобилия",
    tagline: "Вам стыдно зарабатывать много",
    beliefs: [
      "Я не достойна/не достоин больших денег",
      "Деньги – это зло. От них одни проблемы",
      "Деньги портят людей",
      "Большие деньги невозможно заработать честным путем",
      "Все богатые люди – жулики, мошенники и воры",
      "Деньги нечисты, это грязь",
    ],
    quantum: "Когда я не верю в свое благополучие, есть пространство, где я верю в себя и свое благополучие, и я там.",
    description: "Вина блокирует то, что уже идёт к вам. Вы талантливы, но внутренний цензор гасит сигнал. Время снять запрет.",
  },
  empty: {
    name: "Богатый, но пустой",
    tagline: "Деньги есть, вкуса к жизни — нет",
    beliefs: [
      "Не в деньгах счастье",
      "Деньги для меня не имеют особого значения",
      "Мне много не нужно, я могу обойтись малым",
      "Ну и пусть я свожу концы с концами, мне так легче и привычней",
    ],
    quantum: "Когда я живу в комфорте, есть пространство, где я живу в роскоши, и я там.",
    description: "Вы прошли путь зарабатывания, но забыли путь проживания. Изобилие — это не цифра, это вкус каждого дня.",
  },
};

const questions: { q: string; options: { label: string; s: Scenario }[] }[] = [
  {
    q: "Когда приходят неожиданно большие деньги, я…",
    options: [
      { label: "Боюсь их потерять и прячу", s: "fearful" },
      { label: "Сразу думаю, кому помочь", s: "rescuer" },
      { label: "Чувствую лёгкую вину", s: "guilty" },
      { label: "Не чувствую особой радости", s: "empty" },
    ],
  },
  {
    q: "Моя главная фраза о деньгах:",
    options: [
      { label: "«Деньги — это сложно и тревожно»", s: "fearful" },
      { label: "«Я должен/должна обеспечивать»", s: "rescuer" },
      { label: "«Не в деньгах счастье»", s: "guilty" },
      { label: "«Зачем больше, и так норм»", s: "empty" },
    ],
  },
  {
    q: "Когда я вижу человека сильно богаче меня:",
    options: [
      { label: "Думаю — наверное, повезло или нечестно", s: "guilty" },
      { label: "Боюсь, что у меня так не получится", s: "fearful" },
      { label: "Думаю, как ему тяжело за всё отвечать", s: "rescuer" },
      { label: "Не вдохновляюсь, мне это не нужно", s: "empty" },
    ],
  },
  {
    q: "Потратить крупную сумму на себя — это:",
    options: [
      { label: "Стыдно, лучше на семью", s: "guilty" },
      { label: "Страшно, а вдруг закончатся", s: "fearful" },
      { label: "Эгоистично, есть кому нужнее", s: "rescuer" },
      { label: "Не понимаю, чего мне хотеть", s: "empty" },
    ],
  },
  {
    q: "Мой главный финансовый паттерн:",
    options: [
      { label: "Зарабатываю — отдаю — снова пусто", s: "rescuer" },
      { label: "Коплю и боюсь тратить", s: "fearful" },
      { label: "Сливаю деньги, как только появляются", s: "guilty" },
      { label: "Есть деньги, но жизнь как серый фон", s: "empty" },
    ],
  },
  {
    q: "В детстве о деньгах в семье говорили:",
    options: [
      { label: "«Денег нет, не проси»", s: "fearful" },
      { label: "«Мы всё для тебя, надо помогать»", s: "rescuer" },
      { label: "«Богатые — нечестные»", s: "guilty" },
      { label: "«Деньги есть, но не до радости»", s: "empty" },
    ],
  },
  {
    q: "Если бы деньги были человеком, они бы сказали мне:",
    options: [
      { label: "«Ты меня боишься»", s: "fearful" },
      { label: "«Ты меня раздаёшь»", s: "rescuer" },
      { label: "«Ты меня стыдишься»", s: "guilty" },
      { label: "«Ты меня не чувствуешь»", s: "empty" },
    ],
  },
  {
    q: "Что вы чувствуете прямо сейчас, читая это?",
    options: [
      { label: "Тревогу — деньги, опять про деньги", s: "fearful" },
      { label: "Усталость — я и так стараюсь", s: "rescuer" },
      { label: "Лёгкий стыд — это про меня", s: "guilty" },
      { label: "Пустоту — а смысл?", s: "empty" },
    ],
  },
];

function Index() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(Scenario | null)[]>(Array(questions.length).fill(null));
  const [done, setDone] = useState(false);

  const total = questions.length;
  const progress = done ? 100 : Math.round((step / total) * 100);

  const result: Scenario = useMemo(() => {
    const counts: Record<Scenario, number> = { rescuer: 0, fearful: 0, guilty: 0, empty: 0 };
    answers.forEach((a) => a && counts[a]++);
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Scenario) || "rescuer";
  }, [answers]);

  const select = (s: Scenario) => {
    const next = [...answers];
    next[step] = s;
    setAnswers(next);
  };

  const goNext = () => {
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  };

  const goPrev = () => step > 0 && setStep(step - 1);

  const restart = () => {
    setAnswers(Array(total).fill(null));
    setStep(0);
    setDone(false);
  };

  const meta = scenarioMeta[result];

  return (
    <main className="min-h-screen px-3 py-4 sm:px-5 sm:py-8 md:py-12">
      <div className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[32px] bg-card sm:rounded-[48px]"
        style={{ boxShadow: "var(--shadow-card)" }}>

        {/* Hero */}
        <header className="px-6 pb-8 pt-10 text-white sm:px-10 sm:pb-10 sm:pt-12" style={{ background: "var(--gradient-hero)" }}>
          <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur sm:mb-6 sm:text-[13px]">
            БЕСПЛАТНАЯ ДИАГНОСТИКА · 3 МИНУТЫ
          </span>
          <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">
            Квантовая диагностика денег
          </h1>
          <p className="mt-4 max-w-[500px] text-base opacity-90 sm:text-lg">
            Узнайте свой финансовый сценарий и корневое убеждение, которое тихо управляет вашими деньгами.
          </p>
        </header>

        {!done ? (
          <>
            {/* Progress */}
            <div className="bg-card px-6 pt-6 sm:px-10">
              <div className="h-1.5 overflow-hidden rounded-full bg-accent">
                <div className="h-full rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%`, background: "var(--gradient-cta)" }} />
              </div>
              <p className="mt-2.5 text-right text-sm font-medium" style={{ color: "var(--secondary-foreground)" }}>
                Вопрос {step + 1} из {total}
              </p>
            </div>

            {/* Question */}
            <section className="px-6 pb-5 pt-7 sm:px-10 sm:pb-6 sm:pt-8">
              <h2 className="mb-6 text-[22px] font-bold leading-snug tracking-tight sm:mb-7 sm:text-[26px]"
                style={{ color: "oklch(0.22 0.12 295)" }}>
                {questions[step].q}
              </h2>
              <div className="flex flex-col gap-3 sm:gap-3.5">
                {questions[step].options.map((opt, i) => {
                  const selected = answers[step] === opt.s;
                  return (
                    <button
                      key={i}
                      onClick={() => select(opt.s)}
                      className={`flex items-center gap-3.5 rounded-[22px] border-[1.5px] px-5 py-4 text-left text-[15px] font-medium transition-all sm:rounded-[28px] sm:px-6 sm:text-[17px] ${
                        selected
                          ? "border-[oklch(0.55_0.22_295)] bg-[oklch(0.95_0.05_300)]"
                          : "border-border bg-card hover:border-[oklch(0.7_0.15_295)] hover:bg-[oklch(0.98_0.02_300)]"
                      }`}
                      style={selected ? { boxShadow: "var(--shadow-soft)" } : undefined}
                    >
                      <span
                        className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 ${
                          selected ? "border-primary bg-primary" : "border-[oklch(0.78_0.1_295)] bg-card"
                        }`}
                      >
                        {selected && <span className="h-[8px] w-[8px] rounded-full bg-white" />}
                      </span>
                      <span className="text-[oklch(0.25_0.08_290)]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Nav */}
            <div className="flex gap-3 bg-card px-6 pb-8 pt-3 sm:gap-4 sm:px-10 sm:pb-10">
              <button
                onClick={goPrev}
                disabled={step === 0}
                className="flex-1 rounded-full bg-accent px-4 py-3.5 text-base font-semibold text-secondary-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Назад
              </button>
              <button
                onClick={goNext}
                disabled={!answers[step]}
                className="flex-[2] rounded-full px-4 py-3.5 text-base font-semibold text-white transition disabled:cursor-not-allowed"
                style={{
                  background: answers[step] ? "var(--gradient-cta)" : "oklch(0.78 0.1 295)",
                  boxShadow: answers[step] ? "var(--shadow-cta)" : "none",
                }}
              >
                {step === total - 1 ? "Получить результат" : "Далее"}
              </button>
            </div>
          </>
        ) : (
          <section className="bg-card px-6 pb-10 pt-9 sm:px-10 sm:pb-12 sm:pt-10">
            <div className="mb-5 inline-block rounded-full bg-[oklch(0.95_0.05_300)] px-4 py-1.5 text-[13px] font-semibold"
              style={{ color: "oklch(0.42 0.18 295)" }}>
              Ваш сценарий
            </div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]"
              style={{
                background: "var(--gradient-text)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}>
              {meta.name}. {meta.tagline}.
            </h2>

            <p className="mt-5 text-[16px] leading-relaxed sm:text-[17px]" style={{ color: "oklch(0.3 0.06 290)" }}>
              {meta.description}
            </p>

            <div className="my-7 rounded-[22px] border-l-[6px] px-6 py-5 sm:rounded-[24px]"
              style={{ background: "var(--warning-bg)", borderColor: "var(--warning)" }}>
                <div className="mb-3 text-[15px] font-bold sm:text-[18px]" style={{ color: "var(--warning-fg)" }}>
                  Ваши корневые убеждения
                </div>
                <ul className="space-y-2 text-[15px] font-medium sm:text-[16px]" style={{ color: "oklch(0.25 0.05 60)" }}>
                  {meta.beliefs.map((b, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span style={{ color: "var(--warning)" }}>✦</span>
                      <span>«{b}»</span>
                    </li>
                  ))}
                </ul>
            </div>

            <div className="my-7 rounded-[28px] border px-6 py-7 text-center sm:rounded-[32px] sm:px-7"
              style={{ background: "var(--gradient-quantum)", borderColor: "oklch(0.88 0.06 295)" }}>
              <div className="mb-3 text-[12px] font-extrabold uppercase tracking-[2px] sm:text-[14px]"
                style={{ color: "oklch(0.42 0.2 295)" }}>
                Квантовый ключ
              </div>
              <div className="text-[17px] font-semibold leading-relaxed sm:text-[20px]" style={{ color: "oklch(0.22 0.12 295)" }}>
                «{meta.quantum}»
              </div>
            </div>

            <p className="text-center text-[15px] sm:text-base" style={{ color: "oklch(0.4 0.05 290)" }}>
              Хотите перепрошить этот сценарий и открыть канал изобилия?
            </p>

            <a
              href="https://msukhinina.ru/kvantovoe_izobilie"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block rounded-full px-6 py-4 text-center text-[15px] font-bold leading-snug text-white transition hover:scale-[1.01] sm:text-[17px]"
              style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
            >
              Хочу с вами на курс «КВАНТОВОЕ ИЗОБИЛИЕ» →
            </a>

            <button
              onClick={restart}
              className="mt-4 block w-full text-center text-sm font-medium underline-offset-4 hover:underline"
              style={{ color: "oklch(0.45 0.15 295)" }}
            >
              Пройти тест заново
            </button>
          </section>
        )}

        <footer className="border-t bg-card px-6 py-5 text-center text-xs sm:px-10 sm:text-[13px]"
          style={{ color: "oklch(0.45 0.1 295)" }}>
          © Марина Сухинина · Психолог квантового мышления
        </footer>
      </div>
    </main>
  );
}
