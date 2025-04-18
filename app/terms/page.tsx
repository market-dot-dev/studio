import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-marketing-base text-marketing-primary text-pretty font-bold tracking-tight">
        Terms of Service
      </h1>

      <div className="text-marketing-secondary mt-6 space-y-6">
        {/* Intro Section */}
        <p>
          Please carefully read and understand the following Terms of Service (
          <strong>“Terms”</strong>) as they govern your use of our Services (as defined
          below).&nbsp; These Terms are between you and Lab 0324, Inc. (
          <strong>“market.dev”</strong>).&nbsp; When used in these Terms, the terms “us”, “we” and
          “our” refer to Lab 0324, the operating company of the market.dev platform.&nbsp; The term
          “you” means either you as an individual registering to use market.dev personally or the
          company you represent, if registering to use market.dev on behalf of a business.
        </p>

        <p>
          By accessing or using our Services, you agree to be bound by these Terms.&nbsp; If you do
          not agree with any part of these Terms, please do not use our market.dev Platform or
          Services.
        </p>

        {/* Acceptance of Terms */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Acceptance of Terms</h2>
        <p>
          By using our Services, you agree to comply with and be bound by these Terms. These Terms
          may be updated from time to time, and it is your responsibility to review them
          periodically. Your continued use of the market.dev Platform after any changes to these
          Terms signifies your acceptance of those changes.
        </p>

        {/* User Accounts */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">User Accounts</h2>
        <p>
          To access and use the market.dev Platform, you must register for a market.dev account. You
          agree to provide accurate, current, and complete information during the registration
          process and to update such information to keep it accurate, current, and complete.&nbsp;
          To complete your account registration, you must provide us with your full legal name,
          business address, phone number, a valid email address, and any other information indicated
          as required. You must be the older of: (i) 18 years, or (ii) at least the age of majority
          in the jurisdiction where you reside and from which you use the Services to open an
          account.
        </p>
        <p>
          You acknowledge that market.dev will use the email address you provide on opening an
          account or as updated by you from time to time as the primary method for communication
          with you. You are responsible for maintaining the confidentiality of your account
          credentials, including user name and password, and for all activities that occur under
          your account.&nbsp; If you are a company with multiple staff users, you are responsible
          for your staffs’ use of the market.dev Platform and Services and ensuring that they comply
          with all terms and conditions contained in these Terms.&nbsp; market.dev cannot and will
          not be liable for any loss or damage from your failure to maintain the security of your
          account and password.
        </p>
        <p>
          We may request additional security measures at any time and reserve the right to adjust
          these requirements at our discretion. You agree to notify us immediately of any
          unauthorized use of your account or any other breach of security.
        </p>

        {/* Services Provided */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Services Provided</h2>
        <p>
          Through the market.dev Platform, we provide tools for open-source software maintainers to
          market their services and manage relationships with clients. This includes, but is not
          limited to:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            tiered support offerings, assistance in selling across channels, through hosted sites,
            embedded systems, and direct-to-market sale;
          </li>
          <li>
            tools to monitor open-source software utilization by clients and identify additional
            services, including collaboration and business opportunities with other parties, that
            clients may find valuable; and
          </li>
          <li>
            business management: ensuring reports, customers, payments, and contract information are
            in one place (collectively, the <strong>“Services”</strong>).
          </li>
        </ul>
        <p>
          We reserve the right to add to, modify, suspend, or discontinue any part of the market.dev
          Platform or Services at any time by notifying you either through your email address on
          record with us and/or by posting a notice on the market.dev Platform.
        </p>

        {/* Intellectual Property and User Content */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">
          Intellectual Property and User Content
        </h2>
        <p>
          Users may submit or generate content (<strong>“User Content”</strong>), such as company
          logos, graphics, service offering and pricing information, client records, correspondence
          and other information associated with the provision of maintainer services, to the
          market.dev Platform.&nbsp; You retain ownership of your User Content, but by submitting
          it, you grant market.dev a worldwide, royalty-free, non-exclusive license to use,
          distribute, reproduce, modify, adapt, publicly perform, and publicly display your User
          Content.&nbsp; market.dev may from time-to-time analyze User Content in an aggregate and
          secure manner for purposes of improving the market.dev Platform or Services.
        </p>
        <p>
          You represent, warrant, and agree that you have all necessary rights in the User Content
          to grant this license. You irrevocably waive any and all moral rights you may have in the
          User Content in favour of market.dev and agree that this waiver may be invoked by anyone
          who obtains rights in the content through market.dev, including anyone to whom market.dev
          may transfer or grant (including by way of license or sublicense) any rights in the User
          Content.
        </p>
        <p>
          You grant market.dev a non-exclusive, transferable, sub-licensable, royalty-free,
          worldwide right and license to use the names, trademarks, service marks and logos
          associated with your business (<strong>“Your Trademarks”</strong>) to operate, provide,
          and promote the Services and to perform our obligations and exercise our rights under
          these Terms. This license will survive any termination of the Terms solely to the extent
          that market.dev requires the license to exercise any rights or perform any obligations
          that arose during the term of this agreement.
        </p>
        <p>
          You agree that market.dev can, at any time, review and delete any or all of your content
          submitted to the Services, although market.dev is not obligated to do so.&nbsp; Users are
          solely responsible for the content they submit or create, and market.dev does not endorse,
          support, or guarantee the accuracy, completeness, or reliability of any user-generated
          content.
        </p>
        <p>
          You agree that you may not use any trademarks, logos, or service marks of market.dev,
          whether registered or unregistered (<strong>“market.dev Trademarks”</strong>) unless you
          are authorized to do so by market.dev in writing. You agree not to use or adopt any marks
          that may be considered confusing with the market.dev Trademarks. You agree that any
          variations or misspellings of the market.dev Trademarks would be considered confusing with
          the market.dev Trademarks.
        </p>

        {/* Payments and Fees */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Payments and Fees</h2>
        <p>
          Through the market.dev Platform you will be able to purchase various Services by making
          service selections or otherwise updating your account information. You agree to pay any
          and all applicable fees and charges associated with the Services, under additional terms
          and conditions that may be further communicated and defined within the market.dev Platform
          accordingly, that you have purchased using one or more of the payment options offered from
          time-to-time on the market.dev Platform.
        </p>
        <p>
          We reserve the right to change the pricing and fees associated with the Services at any
          time, and such changes will be effective as of the date indicated in the notice either
          communicated to you by email and/or posted on the market.dev Platform.
        </p>

        {/* Code of Conduct */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Code of Conduct</h2>
        <p>
          Users agree not to engage in any conduct that violates these Terms, applicable laws, or
          the rights of others.&nbsp; You agree not to reproduce, duplicate, copy, sell, resell or
          exploit any portion of the market.dev Platform without the express written permission of
          market.dev.
        </p>
        <p>
          You agree not to work around, bypass, or circumvent any of the technical limitations of
          the market.dev Platform, including to process orders outside the market.dev Platform, use
          any tool to enable features or functionalities that are otherwise disabled in the
          market.dev Platform, or decompile, disassemble or otherwise reverse engineer the
          market.dev Platform.&nbsp; You agree not to access the market.dev Platform or monitor any
          material or information from the market.dev Platform using any robot, spider, scraper, or
          other automated means.
        </p>
        <p>
          market.dev may, at its discretion, suspend or terminate the accounts of users who violate
          these Terms or engage in inappropriate conduct.
        </p>

        {/* Confidentiality */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Confidentiality</h2>
        <p>
          For the purposes of these Terms, <strong>“Confidential Information”</strong> refers to any
          non-public, proprietary, or sensitive information disclosed by one party (the{" "}
          <strong>“Disclosing Party”</strong>) to the other party (the{" "}
          <strong>“Receiving Party”</strong>) in connection with the performance of Services under
          these Terms. Confidential Information may include, but is not limited to, trade secrets,
          business plans, customer lists, financial information, and any other information marked or
          reasonably understood to be confidential.
        </p>
        <p>
          Both parties agree to maintain the confidentiality of the Confidential Information
          received from the other party with the same degree of care as they use to protect their
          own confidential information, but in no event less than a reasonable standard of
          care.&nbsp; The Receiving Party shall not disclose, reproduce, or use the Confidential
          Information for any purpose other than the performance of the Services outlined in these
          Terms. The obligations of confidentiality do not apply to information that: (i) is or
          becomes publicly available without breach of these Terms by the Receiving Party; (ii) is
          independently developed by the Receiving Party without reference to the Confidential
          Information; or is rightfully obtained by the Receiving Party from a third party without a
          duty of confidentiality.
        </p>
        <p>
          The Receiving Party may disclose Confidential Information to its employees, agents, or
          subcontractors who need to know such information for the purpose of performing the
          Services, provided that such individuals are bound by obligations of confidentiality at
          least as restrictive as those in these Terms.&nbsp; The obligations of confidentiality
          under these Terms shall survive the termination or expiration of these Terms.
        </p>

        {/* Termination */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Termination</h2>
        <p>
          You may cancel your subscription to the Services at any time by contacting market.dev
          Support using the information contained in the Support section of these Terms.
        </p>
        <p>
          market.dev may suspend or terminate your access to the market.dev Platform or Services at
          any time for any reason, including if you breach any of the terms and conditions in these
          Terms.
        </p>

        {/* Privacy Policy */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Privacy Policy</h2>
        <p>
          By using our market.dev Platform, you agree to our Privacy Policy, which can be
          found&nbsp;
          <Link href="/privacy" className="text-marketing-primary hover:text-marketing-primary/90">
            here
          </Link>
          &nbsp;(link to Privacy Policy).
        </p>

        {/* Indemnity and Limitation of Liability */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">
          Indemnity and Limitation of Liability
        </h2>
        <p>
          Except as otherwise stated explicitly in these Terms, the Services are provided on an “as
          is” and “as available” basis without any warranty or condition, express, implied or
          statutory.&nbsp; market.dev does not warrant that the Services will be uninterrupted,
          timely, secure, or error-free.&nbsp; market.dev does not warrant that the quality of any
          products, services, information, or other materials purchased or obtained by you through
          the Services is suitable for your particular purposes, including any contract templates or
          other document templates that may be made available to you on the market.dev Platform from
          time to time.&nbsp; In no way is market.dev providing any legal advice to you by making
          such templates available.&nbsp; You must seek your own independent legal advice in respect
          of the templates should you wish to receive such advice.
        </p>
        <p>
          market.dev shall not be liable for any direct, indirect, incidental, special,
          consequential or exemplary damages, including but not limited to, damages for loss of
          profits, goodwill, use, data or other intangible losses arising out of or relating to the
          use of or inability to use the Service or these Terms (however arising, including
          negligence).
        </p>
        <p>
          You agree that you shall indemnify and hold harmless market.dev, its affiliates,
          licensors, and each of their officers, directors, other users, employees, attorneys and
          agents from and against any and all claims, costs, damages, losses, liabilities and
          expenses (including reasonable legal fees and costs) arising out of or in connection with:
          (i) your violation or breach of these Terms or any applicable law or regulation, whether
          or not referenced herein; (ii) your violation of any rights of any third party; or (iii)
          your use or misuse of the Services.
        </p>

        {/* Governing Law */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of Ontario,
          Canada and to the fullest extent permitted by applicable law, you agree to irrevocably and
          unconditionally submit to the exclusive jurisdiction of the courts of the Ontario, Canada
          with respect to any dispute, controversy or claim arising out of or in connection with
          these Terms or your use of the Services.
        </p>

        {/* Additional Terms */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Additional Terms</h2>
        <p>
          The failure of market.dev to exercise or enforce any right or provision of these Terms
          shall not constitute a waiver of such right or provision. If any provision of these Terms
          is found by a court of competent jurisdiction to be invalid, the other provisions of these
          Terms will remain in full force and effect.
        </p>
        <p>
          These Terms constitutes the entire understanding between you and market.dev and supersedes
          all prior agreements, whether oral or written, relating to your use of the market.dev
          Platform or Services.
        </p>

        {/* Support */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Support</h2>
        <p>
          Technical support in respect of the Services, including questions about these Terms, is
          available to market.dev Platform users by contacting market.dev support through the
          support channels posted on our website.
        </p>

        {/* Contact Information */}
        <h2 className="text-marketing-primary font-bold tracking-[-0.03em]">Contact Information</h2>
        <p>
          Lab 0324 Inc.
          <br />
          30 Neilor Crescent, Toronto, ON M9C1K4
          <br />
          <a
            href="mailto:contact@lab0324.xyz"
            className="text-marketing-primary hover:text-marketing-primary/90"
          >
            contact@lab0324.xyz
          </a>
        </p>
      </div>
    </div>
  );
}
