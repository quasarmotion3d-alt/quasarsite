"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play, RotateCcw, Square, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import "./motion.css";
import "./interaction-fixes.css";
type P = {
  id: string;
  title: string;
  summary: string;
  credits: string[];
  thumb: string;
  images: string[];
  videos: string[];
  category?: string;
  size?: string;
  videoThumb?: boolean;
};
type Website = { title: string; url: string; label: string };
const asset = (name: string) => `/assets/${name}`;
const im = (...x: string[]) => x.map(asset);
const projects: P[] = [
  {
    id: "solar",
    title: "Tesla solar panels",
    summary: "",
    credits: [],
    thumb: asset("tesla-thumb.webp"),
    images: [],
    videos: ["1222178036"],
    videoThumb: true,
    size: "featured",
  },
  {
    id: "equipeagro",
    title: "EquipeAgro",
    summary: "",
    credits: [],
    thumb: asset("vimeo-hi-1222188457.jpg"),
    images: [],
    videos: ["1222188457"],
    videoThumb: true,
  },
  {
    id: "verdure",
    title: "Verdure",
    summary: "",
    credits: [],
    thumb: asset("verdure-thumb.webp"),
    images: [],
    videos: ["1222171295"],
    videoThumb: true,
  },
  {
    id: "clemarmdc",
    title: "ClemarMDC",
    summary: "",
    credits: [],
    thumb: asset("clemarmdc-thumb.webp"),
    images: [],
    videos: ["1222182732"],
    videoThumb: true,
  },
  {
    id: "thermalcam",
    title: "Thermal Cam",
    summary: "",
    credits: [],
    thumb: asset("thermal-cam-thumb.webp"),
    images: [],
    videos: ["1222175646"],
    videoThumb: true,
  },
  {
    id: "d2d",
    title: "D2D Motors",
    summary: "Visualização automotiva em 3D.",
    credits: [
      "Modeling / Shading / Lighting / Render / Post-Production",
      "Agency: Liberali Design",
    ],
    thumb: asset("d2d-motors-thumb.webp"),
    images: im(
      "img_bd01.jpg",
      "img_bd02e.webp",
      "img_bd03.jpg",
      "img_bd04.jpg",
      "img_bd05.webp",
      "img_bd08.jpg",
      "img_bd13.webp",
      "img_bd12c.jpg",
      "img_bd14b.jpg",
      "img_bd11.jpg",
      "img_bd11b.webp",
      "img_bd10.webp",
      "img_bd09.jpg",
    ),
    videos: [],
  },
  {
    id: "reebok",
    title: "Rockport",
    summary: "",
    credits: [],
    thumb: asset("rockport-thumb.webp"),
    images: im("img_reebok03.webp", "img_reebok01.webp", "img_reebok04.webp"),
    videos: ["1222193899"],
    size: "featured",
  },
  {
    id: "3m",
    title: "3M Automotive Market Center",
    summary:
      "Ilustração 3D de produtos automotivos para catálogo virtual e impresso.",
    credits: ["Client: 3M", "Agency: Liberali Design"],
    thumb: asset("pg_3m_auto04.jpg"),
    images: im(
      "pg_3m_auto03.jpg",
      "pg_3m_auto02.jpg",
      "pg_3m_auto04.jpg",
      "pg_3m_auto05.jpg",
      "pg_3m_auto06.jpg",
      "pg_3m_auto07.jpg",
    ),
    videos: ["1222166294"],
  },
  {
    id: "biometal",
    title: "Biometal",
    summary: "Animação 3D de produto para Biometal.",
    credits: ["Animação 3D de produto"],
    thumb: asset("biometal-thumb-user.webp"),
    images: [],
    videos: ["1221985270"],
    videoThumb: true,
  },
  {
    id: "super-flex-hp",
    title: "Super Flex HP",
    summary: "",
    credits: [],
    thumb: asset("super-flex-hp-thumb.webp"),
    images: [],
    videos: ["1222222107"],
    videoThumb: true,
  },
  {
    id: "chargerchip",
    title: "Chargerchip",
    summary: "",
    credits: [],
    thumb: asset("vimeo-hi-1222209201.jpg"),
    images: [],
    videos: ["1222209201"],
    videoThumb: true,
  },
  {
    id: "brusinox",
    title: "Estufa de defumação",
    summary: "",
    credits: [],
    thumb: asset("vimeo-hi-1222213889.jpg"),
    images: [],
    videos: ["1222213889"],
    videoThumb: true,
  },
  {
    id: "acustic-mask",
    title: "Acoustic Masking",
    summary: "",
    credits: [],
    thumb: asset("goodpack-thumb.webp"),
    images: [],
    videos: ["1222377474"],
    videoThumb: true,
    size: "medium",
  },
  {
    id: "goodpack",
    title: "Goodpack",
    summary: "",
    credits: [],
    thumb: asset("goodpack-warehouse-thumb.webp"),
    images: [],
    videos: ["1222592700"],
    videoThumb: true,
    size: "medium",
  },
  {
    id: "neo-mineral",
    title: "Minerals",
    summary: "",
    credits: [],
    thumb: asset("neo-mineral-thumb.webp"),
    images: [],
    videos: ["1222379988"],
    videoThumb: true,
    size: "featured",
  },
  {
    id: "robotic-arm",
    title: "Robotic Arm",
    summary: "",
    credits: [],
    thumb: asset("robotic-arm-thumb.webp"),
    images: [],
    videos: ["1222381118"],
    videoThumb: true,
  },
];
const aiProjects: P[] = [
  {
    id: "lumos-marketing",
    title: "Lumos Marketing",
    summary: "",
    credits: [],
    thumb: asset("lumos-marketing-thumb.webp"),
    images: [],
    videos: ["1222372317"],
    category: "AI Video",
    videoThumb: true,
  },
  {
    id: "dig-click",
    title: "Dig. click",
    summary: "",
    credits: [],
    thumb: asset("dig-click-thumb.webp"),
    images: [],
    videos: ["1222388045"],
    category: "AI Video",
    videoThumb: true,
  },
];
const websites: Website[] = [
  { title: "Calende", url: "https://calende.com.br", label: "calende.com.br" },
  { title: "WLobo", url: "https://wlobo.com.br", label: "wlobo.com.br" },
  { title: "Logic Automação", url: "https://logic.ind.br/", label: "logic.ind.br" },
];
function Brand() {
  return (
    <a
      href="#top"
      className="wordmark"
      aria-label="QUASAR MOTION COMPANY — início"
    >
      <span className="header-logo-art">
        <img src={asset("quasar-header-logo-cropped.png")} alt="QUASAR MOTION COMPANY" />
        <span className="header-logo-light-pass" aria-hidden="true" />
      </span>
    </a>
  );
}
function FooterBrand() {
  return (
    <a
      href="#top"
      className="wordmark footer-wordmark"
      aria-label="QUASAR MOTION COMPANY — início"
    >
      <img src={asset("quasar-header-logo-cropped.png")} alt="QUASAR MOTION COMPANY" />
    </a>
  );
}
function Video({ id, label }: { id: string; label: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "ended">(
    "idle",
  );
  const send = (method: string, value?: number) =>
    frame.current?.contentWindow?.postMessage(
      { method, value },
      "https://player.vimeo.com",
    );
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!String(e.origin).includes("vimeo.com")) return;
      if (e.data?.event === "play") setStatus("playing");
      if (e.data?.event === "pause" && status !== "ended") setStatus("paused");
      if (e.data?.event === "ended") setStatus("ended");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [status]);
  const play = () => {
    send("play");
    setStatus("playing");
  };
  const pause = () => {
    send("pause");
    setStatus("paused");
  };
  const stop = () => {
    send("pause");
    send("setCurrentTime", 0);
    setStatus("idle");
  };
  const replay = () => {
    send("setCurrentTime", 0);
    send("play");
    setStatus("playing");
  };
  return (
    <div className="internal-video">
      <iframe
        ref={frame}
        src={`https://player.vimeo.com/video/${id}?controls=0&title=0&byline=0&portrait=0&badge=0&pip=0&dnt=1&api=1`}
        allow="autoplay; fullscreen; picture-in-picture"
        title={label}
        allowFullScreen
      />
      {status === "idle" && (
        <button
          className="video-start"
          onClick={play}
          aria-label={`Reproduzir ${label}`}
        >
          <Play fill="currentColor" />
        </button>
      )}
      {status === "ended" && (
        <button className="video-ended" onClick={replay}>
          <RotateCcw /> Reproduzir novamente
        </button>
      )}
      <div className="video-controls">
        {status === "playing" ? (
          <button onClick={pause} aria-label="Pausar">
            <Pause fill="currentColor" />
          </button>
        ) : (
          <button onClick={play} aria-label="Reproduzir">
            <Play fill="currentColor" />
          </button>
        )}
        <button onClick={stop} aria-label="Parar">
          <Square fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
function Card({ p }: { p: P }) {
  const cover = p.thumb || p.images[0];
  const hasIntro = Boolean(p.summary || p.credits.length);
  const category = p.category || "3D / Production";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`tile tile-${p.id} ${p.size || "standard"} ${p.id === "biometal" ? "tile-biometal" : ""} ${p.videoThumb ? "tile-video-thumb" : ""} ${p.category === "AI Video" ? "tile-vertical" : ""}`}
        >
          <img
            src={p.id === "robotic-arm" ? `${cover}?v=2` : cover}
            alt={p.title}
            loading={p.id === "robotic-arm" ? "eager" : "lazy"}
            fetchPriority={p.id === "robotic-arm" ? "high" : undefined}
            decoding="async"
          />
          <span className="tile-shade" />
          <span className="tile-info">
            <small>{category}</small>
            <strong>{p.title}</strong>
          </span>
          <span className="tile-arrow">
            <ArrowRight />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className={`project-modal ${p.category === "AI Video" ? "lumos-project-modal ai-project-modal" : ""}`}
        showCloseButton={false}
      >
        <DialogHeader className="modal-head">
          <div>
            <p>{category}</p>
            <DialogTitle>{p.title}</DialogTitle>
          </div>
          <DialogClose aria-label="Fechar projeto">
            <X />
          </DialogClose>
        </DialogHeader>
        <div className="project-body">
          {hasIntro && (
            <div className="project-intro">
              {p.summary && <DialogDescription>{p.summary}</DialogDescription>}
              {p.credits.length > 0 && (
                <div>
                  <h3>Créditos / Técnicas</h3>
                  <p className="credit-context">
                    Projeto realizado por membros fundadores da Quasar antes da
                    formação do estúdio.
                  </p>
                  {p.credits.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {p.videos.map((v, i) => (
            <Video key={v} id={v} label={`${p.title} — vídeo ${i + 1}`} />
          ))}
          {p.images.map((x, i) => (
            <img
              key={x}
              className="project-image"
              src={x}
              alt={`${p.title} — imagem ${i + 1}`}
              loading="lazy"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
function WebsitePreview({ site }: { site: Website }) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => card.classList.toggle("is-previewing", entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <article className="website-card" ref={cardRef}>
      <div className="website-browser">
        <div className="website-browser-bar">
          <i />
          <i />
          <i />
          <span>{site.label}</span>
        </div>
        <iframe
          src={site.url}
          title={`Prévia automática de ${site.title}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
      <div className="website-meta">
        <div>
          <small>Website</small>
          <h3>{site.title}</h3>
          <a href={site.url} target="_blank" rel="noreferrer">
            {site.label}
          </a>
        </div>
        <a
          className="website-open"
          href={site.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir ${site.title} em nova aba`}
        >
          <ArrowRight />
        </a>
      </div>
    </article>
  );
}
function CategoryState() {
  useEffect(() => {
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>("[data-category-nav]"),
    ];
    const sections = [
      ...document.querySelectorAll<HTMLElement>("[data-category-section]"),
    ];
    const setActive = (id?: string) =>
      links.forEach((link) => {
        const active = Boolean(id) && link.dataset.categoryNav === id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    const syncWithScroll = () => {
      const marker = window.innerHeight * 0.78;
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= marker && rect.bottom > marker;
      });
      setActive(current?.dataset.categorySection);
    };
    const scheduleSync = () => requestAnimationFrame(syncWithScroll);
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    links.forEach((link) => link.addEventListener("click", scheduleSync));
    syncWithScroll();
    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      links.forEach((link) => link.removeEventListener("click", scheduleSync));
    };
  }, []);
  return null;
}
export default function Home() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
  return (
    <main id="top">
      <CategoryState />
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <nav>
            <a href="#work">Trabalho</a>
            <a href="#studio">Sobre</a>
            <a href="#contact">Contato</a>
          </nav>
        </div>
      </header>
      <section className="intro" data-reveal>
        <div>
          <span>Limeira, SP - Brasil</span>
          <h1>
            Produção visual em <em>3D, websites</em> e AI Video.
          </h1>
        </div>
        <p>
          Unimos tecnologia, criatividade e velocidade para transformar conceitos
          em experiências visuais mais impactantes.
        </p>
      </section>
      <section className="reel" id="reel" data-reveal>
        <div className="reel-head">
          <div>
            <h2>Uma seleção direta de animação, visualização e produção 3D.</h2>
          </div>
        </div>
        <div className="reel-video">
          <Video id="1222178036" label="Tesla solar panels" />
        </div>
      </section>
      <section className="studio" id="studio" data-reveal>
        <div className="studio-copy">
          <span>Sobre</span>
          <h2>
            3D + IA para explorar mais caminhos criativos e chegar mais rápido à imagem certa.
          </h2>
          <p>
            Unimos controle técnico, direção de arte e novas ferramentas para produzir visuais com intenção.
          </p>
          <div className="studio-team" aria-label="Equipe Quasar">
            <span>Equipe</span>
            <ul>
              <li><strong>Marco Tomaselli</strong><small>Look dev./textura/pós · AI Videos / Websites</small></li>
              <li><strong>Fabio MR</strong><small>3D Generalista / Motion</small></li>
            </ul>
          </div>
        </div>
        <div className="studio-services" aria-label="Áreas de atuação">
          <a data-category-nav="3d" href="#work-3d">
            <small>01</small>
            <b>3D</b>
          </a>
          <a data-category-nav="websites" href="#work-websites">
            <small>02</small>
            <b>Websites</b>
          </a>
          <a data-category-nav="ai-video" href="#work-ai-video">
            <small>03</small>
            <b>AI Video</b>
          </a>
        </div>
      </section>
      <section
        className="portfolio work-category"
        id="work-3d"
        data-category-section="3d"
      >
        <div className="portfolio-bar" data-reveal>
          <div>
            <strong>Trabalhos em 3D</strong>
            <span>{projects.length} projetos</span>
          </div>
        </div>
        <div className="mosaic" data-reveal>
          {projects.map((p) => (
            <Card p={p} key={p.id} />
          ))}
        </div>
      </section>
      <section
        className="work-category websites-section"
        id="work-websites"
        data-category-section="websites"
        data-reveal
      >
        <div className="portfolio-bar websites-bar" data-reveal>
          <div>
            <strong>Websites</strong>
            <span>Sites claros para marcas, produtos e serviços.</span>
          </div>
        </div>
        <div className="websites-grid">
          {websites.map((site) => (
            <WebsitePreview key={site.url} site={site} />
          ))}
        </div>
      </section>
      <section
        className="portfolio work-category ai-projects"
        id="work-ai-video"
        data-category-section="ai-video"
      >
        <div className="portfolio-bar" data-reveal>
          <div>
            <strong>AI Video</strong>
            <span>{aiProjects.length} projeto + 3 em breve</span>
          </div>
        </div>
        <div className="mosaic" data-reveal>
          {aiProjects.map((project) => (
            <Card p={project} key={project.id} />
          ))}
          {Array.from({ length: 2 }, (_, index) => (
            <article
              className="ai-placeholder tile-vertical"
              key={`ai-placeholder-${index}`}
              aria-label="Projeto de AI Video em breve"
            >
              <span>Em breve</span>
            </article>
          ))}
        </div>
      </section>
      <footer id="contact">
        <div className="contact-block" data-reveal>
          <span>Contato</span>
          <p>Tem um projeto em mente?</p>
          <a href="mailto:quasarmotion3d@gmail.com">
            quasarmotion3d@gmail.com <ArrowRight />
          </a>
        </div>
        <div className="footer-partner" data-reveal>
          <div className="footer-partner-brand">
            <span>Parceiros:</span>
            <span className="lumos-emblem" aria-hidden="true">
              <img
                src={asset("lumos-original-logo.webp")}
                alt=""
                loading="eager"
                fetchPriority="high"
              />
            </span>
          </div>
          <a
            className="lumos-whatsapp"
            href="https://wa.me/5519994236498"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 3.25a12.54 12.54 0 0 0-10.72 19.06L3.8 28.75l6.62-1.43A12.55 12.55 0 1 0 16 3.25Zm0 22.87a10.3 10.3 0 0 1-5.25-1.43l-.38-.23-3.93.85.84-3.83-.25-.4A10.3 10.3 0 1 1 16 26.12Zm5.65-7.72c-.31-.15-1.84-.91-2.12-1.01-.28-.1-.49-.15-.69.15-.21.31-.8 1.01-.98 1.22-.18.21-.36.23-.67.08a8.4 8.4 0 0 1-2.48-1.53 9.27 9.27 0 0 1-1.72-2.14c-.18-.31-.02-.48.13-.63.14-.14.31-.36.46-.54.16-.18.21-.31.31-.52.1-.2.05-.38-.03-.53-.08-.15-.69-1.66-.95-2.28-.25-.6-.51-.51-.69-.52h-.59c-.21 0-.54.08-.82.38-.28.31-1.08 1.05-1.08 2.56s1.1 2.97 1.25 3.18c.15.2 2.16 3.3 5.23 4.63.73.31 1.3.5 1.75.64.73.23 1.39.2 1.91.12.58-.09 1.84-.75 2.1-1.47.26-.72.26-1.34.18-1.47-.08-.13-.28-.2-.59-.36Z" />
            </svg>
            <span>Falar com a Lumos no WhatsApp</span>
            <span className="lumos-native-arrow" aria-hidden="true">
              <ArrowRight className="lumos-arrow" />
            </span>
          </a>
        </div>
        <div className="footer-details" data-reveal>
          <FooterBrand />
          <nav aria-label="Navegação do rodapé">
            <a href="#work-3d">Trabalhos</a>
            <a href="#studio">Sobre</a>
            <a href="#contact">Contato</a>
          </nav>
          <span>Limeira, SP - Brasil</span>
        </div>
        <div className="footer-bottom footer-centered" data-reveal>
          <small>
            © 2026 QUASAR MOTION COMPANY. Todos os direitos reservados.
          </small>
        </div>
      </footer>
    </main>
  );
}
