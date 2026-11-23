import { Wordmark } from '../glass/GlassNav'
import { mailto, sectionLink, site } from '../../config/site'
import { FooterGrass } from './FooterGrass'

export function Footer() {
  return (
    <footer id="footer" className="studio-footer">
      <div className="container footer">
        <div>
          <Wordmark />
          <a href={mailto}>{site.email}</a>
        </div>
        <div className="footer-links">
          <a href={sectionLink('services')}>{site.nav[0].label}</a>
          <a href={sectionLink('contact')}>{site.contact.label}</a>
          <a href={site.privacyPath}>{site.ui.privacy}</a>
          <a href={site.termsPath}>{site.ui.terms}</a>
        </div>
        <div className="fine">
          <span>
            © {new Date().getUTCFullYear()} {site.name}
          </span>
          <span>{site.footer.credit}</span>
        </div>
      </div>
      <FooterGrass />
    </footer>
  )
}
