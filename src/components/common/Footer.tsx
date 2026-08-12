import React, { useState } from "react"
import AnimatedStarfish from "../home/AnimatedStarfish"

// 1. Define the TypeScript Interface for our Location Data
interface ContactLocation {
  id: string
  city: string
  name: string
  mobile: string
  email: string
  address: string
}

const SquigglyLine = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="21"
    viewBox="0 0 21 606"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <g clipPath="url(#clip0_1_1731)">
      <path
        d="M20.7959 385.51C20.9686 383.866 21.0157 382.318 20.9843 380.85C20.9843 379.653 20.9372 378.441 20.7959 377.18C20.7959 377.036 20.7645 376.909 20.7332 376.765C20.9215 374.132 20.8744 371.403 20.4663 368.467C19.6031 362.323 15.4125 356.243 14.5493 350.594C14.4394 349.876 14.3767 349.174 14.3139 348.488C14.3296 348.184 14.3296 347.865 14.361 347.546C15.3811 340.253 20.0112 333.854 20.7959 326.083C21.1098 323.003 21.0314 320.258 20.7175 317.721C20.7645 317.146 20.7959 316.572 20.8116 315.981C20.9686 314.258 21.0157 312.503 20.9215 310.667C21.0157 308.848 20.9843 306.981 20.7959 305.034C19.9955 297.135 15.8677 291.374 14.6121 283.555C16.1031 272.448 21.565 263.129 20.9215 251.256C20.9686 250.411 20.9686 249.549 20.9686 248.671C21.0314 246.932 20.9843 245.128 20.7959 243.245C19.9641 235.075 15.5695 229.203 14.5022 220.968C15.4753 207.851 22.2242 198.037 20.7959 183.818C20.7959 183.675 20.7488 183.531 20.7332 183.387C20.9215 180.77 20.8744 178.026 20.4663 175.089C19.6031 168.946 15.4125 162.866 14.5493 157.217C14.4394 156.483 14.3767 155.78 14.3139 155.062C15.0201 142.36 21.5179 132.53 20.7959 119.013C21.0157 116.668 21.0627 114.226 20.7959 111.657C19.917 103.072 15.1143 97.0075 14.361 88.0711C15.6636 75.7995 22.1614 65.9057 20.7959 52.2298C19.9013 43.3732 14.8004 37.2294 14.2825 27.8302C13.7018 17.3937 17.7354 9.11161 19.7914 0.015625C14.9888 0.57415 10.1704 0.973097 5.38338 1.19651C3.26454 9.81376 -0.392407 17.8406 0.156921 27.8142C0.674858 37.2134 5.76006 43.3572 6.65468 52.2138C6.95288 55.1501 6.85871 57.8948 6.56051 60.5438C6.16813 60.5598 5.77575 60.6077 5.38338 60.6236C3.26454 69.2568 -0.392407 77.2677 0.156921 87.2413C0.156921 87.5126 0.204006 87.7679 0.219701 88.0233C-0.109895 91.0872 -0.125591 94.3107 0.423737 97.7735C1.30266 103.423 5.49324 109.519 6.34078 115.646C6.49773 116.763 6.5919 117.849 6.65468 118.918C5.52463 131.524 -1.11438 141.482 0.172616 155.062C0.0941404 156.467 0.0627503 157.903 0.141226 159.403C0.643468 168.674 5.60311 174.786 6.5919 183.451C5.72867 195.515 -0.156981 205.01 0.125531 217.569C0.0784453 218.75 0.0784453 219.963 0.141226 221.208C0.156921 221.623 0.204006 222.021 0.251091 222.42C0.141226 225.053 0.282481 227.83 0.784723 230.814C1.8049 236.942 5.80715 242.591 6.5762 248.783C6.63898 249.293 6.67037 249.788 6.70176 250.283C6.60759 251.528 6.48203 252.74 6.29369 253.937C5.97979 253.953 5.68158 253.985 5.36768 254.001C3.24885 262.634 -0.408102 270.645 0.141226 280.635C0.156921 280.922 0.188311 281.193 0.219701 281.465C-0.0157251 283.683 -0.0785053 285.965 0.109835 288.374C0.109835 289.236 0.109835 290.098 0.156921 290.975C0.674858 300.407 4.72419 306.901 6.24661 315.535C4.47306 326.482 -0.831869 335.721 0.109835 347.801C0.109835 348.137 0.109835 348.488 0.125531 348.823C0.0470552 349.94 0.0156651 351.057 0.141226 352.222C0.141226 352.413 0.141226 352.589 0.141226 352.764C0.533602 360.025 3.65692 365.339 5.46185 371.451C5.93271 373.27 6.32508 375.137 6.56051 377.164C5.71297 387.776 1.03584 396.409 0.204006 406.957C-0.0157251 408.473 -0.0471152 410.037 0.109835 411.649C0.109835 411.84 0.109835 412.016 0.109835 412.191C0.141226 412.894 0.219701 413.58 0.298176 414.234C0.0627502 417.33 0.141226 420.601 0.737638 424.16C1.75782 430.288 5.76006 435.937 6.52912 442.128C6.5919 442.639 6.60759 443.134 6.65468 443.644C5.71297 455.82 -0.298236 465.299 0.235396 478.496C0.0470552 480.379 -0.0157251 482.326 0.0941404 484.337C0.659163 494.422 5.24212 501.156 6.48203 510.747C5.16365 521.423 0.0156651 530.503 0.0627503 541.897C-0.0785053 543.397 -0.0628103 544.929 0.188311 546.541H0.360957C1.85199 557.759 7.97306 565.1 6.5762 578.855C5.60311 588.558 -1.3812 596.106 0.172616 605.968H14.2982C12.7444 596.122 19.7287 588.558 20.7175 578.855C22.2085 563.983 14.926 556.61 14.204 543.748C14.1726 543.11 14.1726 542.503 14.1726 541.881C14.8789 534.157 19.8856 527.535 20.7175 519.412C21.0471 516.205 20.9372 513.348 20.5919 510.699C20.9529 507.795 21.0314 504.763 20.639 501.539C19.8699 495.348 15.8677 489.699 14.8475 483.571C14.5493 481.8 14.408 480.108 14.3453 478.48C15.5224 466.384 21.8004 456.57 20.7645 443.676C20.9372 441.41 20.9686 439.064 20.7175 436.575C19.8856 428.389 15.4753 422.5 14.408 414.202C15.13 404.819 18.7713 397.127 20.2623 388.287C20.4663 387.361 20.6233 386.419 20.7175 385.462L20.7959 385.51Z"
        fill="#8BDEFF"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_1731">
        <rect width="21" height="606" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const DownloadIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_2047)">
      <path
        d="M19.92 0L21.84 0.24C35.67 2.55 42.31 19 33.57 30.23C23.72 42.89 3.71004 38.09 0.420039 22.63L0.0100391 19.92C0.0400391 19.15 -0.0399609 18.35 0.0100391 17.58C0.560039 8.24 8.33004 0.52 17.66 0H19.93H19.92ZM20.29 20.28V6.11C20.29 6.11 20.07 5.7 20.03 5.64C19.4 4.75 18.11 4.75 17.48 5.64C17.44 5.7 17.22 6.08 17.22 6.11V20.28C17.09 20.31 17.07 20.23 17 20.17C15.85 19.29 14.79 17.71 13.63 16.8C12.09 15.59 10.29 17.42 11.4 18.96C13.56 20.8 15.52 23.5 17.7 25.26C18.38 25.81 19.08 25.83 19.79 25.3C21.62 23.16 24.26 21.23 26.01 19.08C27.31 17.48 25.39 15.66 23.96 16.73C22.79 17.61 21.69 19.28 20.52 20.17C20.45 20.23 20.43 20.31 20.3 20.28H20.29ZM12.44 27.7C10.58 27.96 10.62 30.56 12.43 30.82H25.01C26.9 30.6 26.96 27.92 25.01 27.69H12.45L12.44 27.7Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_2047">
        <rect width="37.51" height="37.48" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
const contactData: ContactLocation[] = [
  {
    id: "1",
    city: "Assam & Northeast",
    name: "Primary Contact:\nMs. Najuma Yeasmin\n(Education Officer)\n\nMs. Archita Baruah Bhattacharyya\n(State Director)",
    mobile: "9365174722\n9435143305",
    email: "nyeasmin[at]wwfindia[dot]net\nabaruah[at]wwfindia[dot]net",
    address:
      "WWF-India Assam & Arunachal Pradesh State Office 202, Meghmallar House, F.C. Road, Uzanbazar, Guwahati, Assam\nPIN CODE: 781001",
  },
  {
    id: "2",
    city: "Andhra Pradesh & Telangana",
    name: "Primary Contact:\nMs. Honey Seles Kundeti\n(Programme Officer)\n\nMr. Akbar Shaik\n(Senior Education Officer)\n\nMs. Farida Tampal\n(State Director)",
    mobile: "9666651068\n7989009059\n8074419076",
    email: "hskundeti[at]wwfindia[dot]net\nsakbar[at]wwfindia[dot]net",
    address:
      "WWF India, Hyderabad Office, H.No. 1-2-228/42 Plot No.21 SBH Colony Domalguda, Gagan Mahal Opp. Hyderabad Study Circle Lane, Hyderabad\nPIN CODE: 500029",
  },
  {
    id: "3",
    city: "Delhi",
    name: "Primary Contact:\nMs. Kavita Khulbe\n(Programme Officer)\n\nMs. Aarti Dalal\n(Manager)",
    mobile: "9958982352\n011-41504790\n7428056770",
    email:
      "wildwisdom[at]wwfindia[dot]net\nkkhulbe[at]wwfindia[dot]net\nadalal[at]wwfindia[dot]net",
    address: "WWF-India, 172-B Lodi Esate, New Delhi-110003",
  },
  {
    id: "4",
    city: "Gujarat",
    name: "Primary Contact:\nMr. Mautik Dave\nState Coordinator",
    mobile: "9898197875",
    email: "mdave[at]wwfindia[dot]net",
    address:
      "WWF-India Valsad Divisional Office 102, Sai Srushti Plaza,\nOpp. Atul, First Gate - 396020 Dist. Valsad (Gujarat)",
  },
  {
    id: "5",
    city: "Himachal Pradesh",
    name: "Primary Contact:\nMs. Kavita Khulbe\n(Programme Officer)\n\nMs. Aarti Dalal\n(Manager)",
    mobile: "9958982352\n011-41504790\n7428056770",
    email:
      "wildwisdom[at]wwfindia[dot]net\nkkhulbe[at]wwfindia[dot]net\nadalal[at]wwfindia[dot]net",
    address: "WWF-India, 172-B Lodi Esate, New Delhi-110003",
  },
  {
    id: "6",
    city: "Haryana",
    name: "Primary Contact:\nMs. Kavita Khulbe\n(Programme Officer)\n\nMs. Aarti Dalal\n(Manager)",
    mobile: "9958982352\n011-41504790\n7428056770",
    email:
      "wildwisdom[at]wwfindia[dot]net\nkkhulbe[at]wwfindia[dot]net\nadalal[at]wwfindia[dot]net",
    address: "WWF-India, 172-B Lodi Esate, New Delhi-110003",
  },
  {
    id: "7",
    city: "Jammu and Kashmir",
    name: "Primary Contact:\nPhuntsog Angmo\n(Senior Education Officer)\n\nMs. Kavita Khulbe\n(Programme Officer)",
    mobile: "6006147350\n9958982352",
    email: "pangmo[at]wwfindia[dot]net\nwildwisdom[at]wwfindia[dot]net",
    address:
      "WWF-India Western Himalayas Conservation Programme 2nd Floor, Padma Wangtak Complex Near ITBF Gate, Moti Market, Leh UT Ladakh | India | 194101",
  },
  {
    id: "8",
    city: "Karnataka",
    name: "Primary Contact:\nMs. Surabhi Deshpande\n(Senior Education Officer)",
    mobile: "9663479395",
    email: "sdeshpande[at]wwfindia[dot]net",
    address:
      "WWF-India Bangalore Office No. 116, 11th Cross, 3rd Floor, Margosa road, Malleshwaram, Bangalore - 560003",
  },
  {
    id: "9",
    city: "Kerala",
    name: "Primary Contact:\nMr. A.K. Sivakumar\n(Senior Education Officer)\n\nMr. Renjan Mathew Varghese\n(State Director)",
    mobile: "9447386978\n9847287725",
    email: "asivakumar[at]wwfindia[dot]net\nrenjanmv[at]wwfindia[dot]net",
    address:
      "WWF-India, Kerala State Office, C.O. Madhavan Road, Vanchiyoor PO, Thiruvananthapuram - 695035",
  },
  {
    id: "10",
    city: "Ladakh",
    name: "Primary Contact:\nPhuntsog Angmo\n(Senior Education Officer)\n\nMs. Kavita Khulbe\n(Programme Officer)",
    mobile: "6006147350\n9958982352",
    email: "pangmo[at]wwfindia[dot]net\nwildwisdom[at]wwfindia[dot]net",
    address:
      "WWF-India Western Himalayas Conservation Programme 2nd Floor, Padma Wangtak Complex Near ITBF Gate, Moti Market, Leh UT Ladakh | India | 194101",
  },
  {
    id: "11",
    city: "Maharashtra",
    name: "Primary Contact:\nMr. Shubham Bhise\n(Education Officer)\n\nFarmeen Mistry\n(State Director)",
    mobile: "8286812872\n9820087878",
    email: "sbhise[at]wwfindia[dot]net\nfmistry[at]wwfindia[dot]net",
    address:
      "WWF-India, Maharashtra State Office c/o Godrej & Boyce premises Above Stone Source, Bombay Gas Lane Lalbaug, Parel, Mumbai 400012",
  },
  {
    id: "12",
    city: "Madhya Pradesh and Chhattisgarh",
    name: "Primary Contact:\nMr. Abhay Rai\n(Education Officer)\n\nDr. Swati Moghe\n(State Director)",
    mobile: "9644466299\n9479864409",
    // mobile: "9644466299\n9004085952",
    email: "arai[at]wwfindia[dot]net\nsmoghe[at]wwfindia[dot]net",
    address:
      "WWF-India, M.P. & Chhattisgarh State RAIWA Building, Paryavaran Parisar, E-5, Arera Colony, Bhopal - 462016, Madhya Pradesh",
  },
  {
    id: "13",
    city: "Odissa",
    name: "Primary Contact:\nMs. Kavita Khulbe\n(Programme Officer)\n\nMs. Aarti Dalal\n(Manager)",
    mobile: "9958982352\n011-41504790\n7428056770",
    email:
      "wildwisdom[at]wwfindia[dot]net\nkkhulbe[at]wwfindia[dot]net\nadalal[at]wwfindia[dot]net",
    address: "WWF-India, 172-B Lodi Esate, New Delhi-110003",
  },
  {
    id: "14",
    city: "Puducherry",
    name: "Primary Contact:\nMs. Subhiksha Lakshmi Maxima\n(Senior Education Officer)\n\nMr. S. Saravanan\n(State Coordinator)",
    mobile: "7358773569\n9176325015",
    email: "slmaxima[at]wwfindia[dot]net\nSsaravanan[at]wwfindia[dot]net",
    address:
      "WWF-India No 29 Rajam’s GardenKK Nagar Edyarpalayam Coimbatore, Tamil Nadu- 641025",
  },
  {
    id: "15",
    city: "Punjab and Chandigarh",
    name: "Primary Contact:\nMs. Kavita Khulbe\n(Programme Officer)\n\nMs. Aarti Dalal\n(Manager)",
    mobile: "9958982352\n011-41504790\n7428056770",
    email:
      "wildwisdom[at]wwfindia[dot]net\nkkhulbe[at]wwfindia[dot]net\nadalal[at]wwfindia[dot]net",
    address: "WWF-India, 172-B Lodi Esate, New Delhi-110003",
  },
  {
    id: "16",
    city: "Rajasthan",
    name: "Primary Contact:\nMr. Arun Soni\n(State Coordinator, Rajasthan)\n\nMs. Tanya Gupta\n(Sr. Programme Officer)\n(Jaipur)",
    mobile: "9828066650\n9887700404",
    email: "asoni[at]wwfindia[dot]net\ntgupta[at]wwfindia[dot]net",
    address:
      "WWF-India, Udaipur Divisional Office, Biological Park, Director Building, Sajjangarh, Udaipur, Rajasthan- 313001",
  },
  {
    id: "17",
    city: "Tamil Nadu",
    name: "Primary Contact:\nMs. Subhiksha Lakshmi Maxima\n(Senior Education Officer)\n\nMr. S. Saravanan\n(State Coordinator)",
    mobile: "7358773569\n9176325015",
    email: "slmaxima[at]wwfindia[dot]net\nSsaravanan[at]wwfindia[dot]net",
    address:
      "WWF-India No 29 Rajam’s GardenKK Nagar Edyarpalayam Coimbatore, Tamil Nadu- 641025",
  },
  {
    id: "18",
    city: "Uttarakhand",
    name: "Primary Contact:\nMs. Kavita Khulbe\n(Programme Officer)\n\nMs. Aarti Dalal\n(Manager)",
    mobile: "9958982352\n011-41504790\n7428056770",
    email:
      "wildwisdom[at]wwfindia[dot]net\nkkhulbe[at]wwfindia[dot]net\nadalal[at]wwfindia[dot]net",
    address: "WWF-India, 172-B Lodi Esate, New Delhi-110003",
  },
  {
    id: "19",
    city: "Uttar Pradesh",
    name: "Primary Contact:\nMs. Kavita Khulbe\n(Programme Officer)\n\nMs. Aarti Dalal\n(Manager)",
    mobile: "9958982352\n011-41504790\n7428056770",
    email:
      "wildwisdom[at]wwfindia[dot]net\nkkhulbe[at]wwfindia[dot]net\nadalal[at]wwfindia[dot]net",
    address: "WWF-India, 172-B Lodi Esate, New Delhi-110003",
  },
  // {
  //   id: "20",
  //   city: "West Bengal, Jharkhand & Bihar",
  //   name: "Primary Contact:\nDr. Sangita Mitra\n(State Director)",
  //   mobile: "9231841534",
  //   email: "smitra[at]wwfindia[dot]net",
  //   address:
  //     "WWF-India West Bengal State Office Tata Centre, 1st Floor 43, J. L. Nehru Road Kolkata -700 071 West Bengal",
  // },

  {
    id: "20",
    city: "West Bengal, Jharkhand & Bihar",
    name: "Primary Contact:\nDr. Sangita Mitra\n(State Director)",
    mobile: "9477464145\n8910987533\n",
    email:
      "smitra[at]wwfindia[dot]net\navinabadas6[at]gmail[dot]com\n",
    address:
      "WWF-India,  West Bengal State Office  Tata centre, Annexe 43 J L Nehru Road Kolkata 700071",
  },
  {
    id: "21",
    city: "Goa",
    name: "Primary Contact:\nMs. Lisha Da Costa\n(Sr. Programme Officer)",
    mobile: "9923740869",
    email: "ldcosta[at]wwfindia[dot]net",
    address:
      "World Wide Fund for Nature India\nBehind Goa Science center Miramar Panaji Goa\n403001",
  },
].sort((a, b) => a.city.localeCompare(b.city))
export default function FooterSection() {
  const [selectedLocation, setSelectedLocation] =
    useState<ContactLocation | null>(null)

  const reports = [
    {
      year: 2022,
      url: "/pdf/Final_WWGC%202022%20Report_17%20March.pdf",
    },
    {
      year: 2023,
      url: "/pdf/WWGC2023%20final%20spread.pdf",
    },
    {
      year: 2024,
      url: "/pdf/Wild%20Wisdom%202024%20Report.pdf",
    },
    {
      year: 2025,
      url: "/pdf/Wild%20Wisdom%20Report%202025.pdf",
    },
  ]

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locId = e.target.value
    const location = contactData.find((item) => item.id === locId)
    setSelectedLocation(location || null)
  }

  return (
    <div className="foot relative" id="announcements">
      <footer className="bg-wwf-ocean-semi-dark relative pt-16 pb-20 text-white md:pt-24 md:pb-24">
        {/* SVG Wave */}
        <div className="absolute bottom-full left-0 h-6 w-full translate-y-px">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="footer-wave"
                x="0"
                y="0"
                width="80"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0,12 Q20,0 40,12 T80,12 L80,24 L0,24 Z"
                  fill="#003645"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-wave)" />
          </svg>
        </div>

        {/* Floating Starfish */}
        <div className="pointer-events-none absolute top-4 -left-12 w-20 -rotate-15 opacity-90 max-[992px]:overflow-hidden md:top-[-10%] md:left-8 md:w-40">
          <AnimatedStarfish className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute right-4 bottom-10 z-99 hidden w-20 rotate-15 opacity-90 max-[992px]:overflow-hidden sm:block md:right-8 md:bottom-12 md:w-48">
          <AnimatedStarfish className="h-full w-10" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 lg:px-12">
          {/* ==========================================
              TOP ROW: 3 Columns (Using flex order for mobile/desktop layout)
          ========================================== */}
          <div className="flex w-full flex-col items-start justify-between gap-12 md:flex-row md:gap-6">
            {/* 1. ANNOUNCEMENTS SECTION - Always first */}
            <div className="order-1 flex flex-1 flex-col gap-6">
              <h2 className="font-wwf text-3xl tracking-wider md:text-[34px] lg:text-[40px]">
                ANNOUNCEMENTS
              </h2>
              <p className="max-w-70 text-sm leading-relaxed text-white/90 italic md:text-base">
                Watch this space for all the latest WWGC Updates!
              </p>

              <div
                className="flex w-full max-w-[320px] items-center gap-4 rounded-md px-5 py-4"
                style={{ border: "1px solid white" }}
              >
                <svg
                  width="71"
                  height="69"
                  viewBox="0 0 71 69"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-15 w-15"
                >
                  <path
                    d="M38.0011 0.0312097L35.7211 18.3712C37.7011 18.831237.0511 17.7812 37.6911 16.9312C38.9911 15.1812 40.7211 12.0612 42.2011 10.7312C45.6511 7.62121 48.5911 10.5512 45.9911 14.5212C42.1611 20.3612 34.4611 26.4412 30.0611 32.9712C26.6111 38.0812 22.1411 50.5812 16.0611 51.8312C10.3211 53.0012 1.33111 48.0812 0.101114 42.1012C-0.738886 38.0412 3.87111 35.9912 5.93111 33.3012C7.99111 30.6112 7.21111 26.9712 12.4311 26.7412C14.3611 26.6512 16.2111 28.4612 17.3411 26.3412C16.9011 21.7312 11.0211 8.65121 18.9111 9.22121C18.8711 14.2412 20.2411 19.2612 22.3511 23.7412C26.1011 17.7212 18.8811 4.69121 27.3111 1.59121C29.0911 4.76121 27.1611 7.56121 27.2511 10.3712C27.3211 12.4612 27.6411 20.2512 30.3711 19.9212C29.8911 16.4712 32.4911 1.67121 35.1211 0.23121C35.9411 -0.21879 37.0911 0.14121 38.0111 0.0612097L38.0011 0.0312097ZM15.6511 31.5512C11.6111 27.5112 6.24111 36.2712 12.5811 37.3312C16.1711 37.9312 17.7211 33.6312 15.6511 31.5512Z"
                    fill="#A0F5FF"
                  />
                  <path
                    d="M55.6011 30.5816C59.3211 32.6216 61.9711 27.1116 64.4111 26.7516C72.6811 25.5616 73.3411 43.7916 65.2511 43.3516C62.3111 43.1916 59.0811 39.0416 56.3111 40.8716C53.7611 42.5616 59.4411 47.3716 57.5211 49.7016C55.0311 53.7716 39.2111 46.6816 44.1211 60.3916H34.1911L36.4811 65.7416L26.2611 63.4016L25.0211 68.0416C18.7711 69.3216 17.8411 51.2316 20.8211 51.2416L27.6911 58.1016C30.0211 56.6116 26.9111 55.4816 27.3211 53.5216L36.7511 54.9816L37.9811 53.2116C35.0611 46.9016 42.2011 47.0216 46.4211 45.1016C47.4311 44.0416 46.3511 43.6616 45.2611 43.5616C42.6011 43.3016 39.9111 44.7116 37.4411 44.9416C34.0911 45.2516 35.8011 43.0916 37.2211 41.6516C38.1511 40.7116 50.2911 32.0016 48.7111 30.6016C45.4511 29.0516 33.1711 41.8716 31.9111 40.5316C33.3411 34.5616 42.5811 21.2116 48.5311 20.0516C53.6411 19.0516 57.8811 25.8116 55.6111 30.5816H55.6011Z"
                    fill="#A0F5FF"
                  />
                </svg>

                <div className="text-lg leading-tight font-medium">
                  <span className="block">Last Date to Register</span>
                  <span className="block">15th August, 2025</span>
                </div>
              </div>
            </div>

            {/* DIVIDER 1 */}
            <div className="order-2 hidden h-62.5 flex-col items-center justify-center opacity-90 md:flex">
              <SquigglyLine className="h-full w-auto" />
            </div>

            {/* 2. CONTACT US SECTION - Last on mobile (order-4), Middle on desktop (md:order-3) */}
            <div className="order-4 flex flex-1 flex-col gap-6 md:order-3">
              <h2 className="font-wwf text-3xl tracking-wider md:text-[34px] lg:text-[40px]">
                CONTACT US
              </h2>

              <div className="flex flex-col gap-1 text-sm leading-[1.2] text-white/90 italic md:text-base">
                <p className="font-bold">Office Address: WWF-India, 172-B,</p>
                <p className="font-bold">Lodi Estate New Delhi-110003</p>
                <p className="font-bold">
                  Email ID: wildwisdom[at]wwfindia[dot]net
                </p>
              </div>

              <p className="max-w-70 text-sm leading-[1.2] text-white/90 italic md:text-base">
                Find us here, in case things aren't clear!
              </p>

              <div className="w-full">
                <select
                  value={selectedLocation ? selectedLocation.id : ""}
                  onChange={handleLocationChange}
                  className="w-full cursor-pointer appearance-none rounded bg-[#d9d9d9] px-4 py-3 text-lg text-[#5D5D5D] transition-colors outline-none hover:bg-white"
                >
                  <option value="">-- Select State --</option>
                  {contactData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.city.trim()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DIVIDER 2 */}
            <div className="order-3 hidden h-62.5 flex-col items-center justify-center opacity-90 md:order-4 md:flex">
              <SquigglyLine className="h-full w-auto" />
            </div>

            {/* 3. REPORTS SECTION - Middle on mobile (order-2), Last on desktop (md:order-5) */}
            <div className="order-2 flex flex-1 flex-col gap-6 max-sm:w-full md:order-5">
              <h2 className="font-wwf text-3xl tracking-wider md:text-[34px] lg:text-[40px]">
                WWF REPORTS
              </h2>

              <div className="flex w-full max-w-[320px] flex-col gap-6">
                {reports.map((report) => (
                  <a
                    key={report.year}
                    href={report.url}
                    target="_blank"
                    className="group flex w-full items-center justify-between transition-colors hover:opacity-80"
                  >
                    <span className="text-sm font-bold md:text-base">
                      Wild Wisdom Report {report.year}
                    </span>
                    <div className="h-6 w-6 shrink-0 transition-transform group-hover:scale-110">
                      <DownloadIcon />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ==========================================
              BOTTOM ROW: Dynamic Address details
          ========================================== */}
          {selectedLocation && (
            <div className="bg-ocean-deep mt-8 w-full animate-in rounded-2xl p-6 text-lg text-white/90 shadow-md backdrop-blur-sm fade-in slide-in-from-top-4 md:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <h5 className="text-xl font-bold text-white underline decoration-(--wwf-sea-green) underline-offset-4">
                    Contact person
                  </h5>
                  <p className="leading-relaxed whitespace-pre-line text-white/90">
                    {selectedLocation.name}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <h5 className="text-xl font-bold text-white underline decoration-(--wwf-sea-green) underline-offset-4">
                    Contact numbers
                  </h5>
                  <p className="leading-relaxed whitespace-pre-line text-white/90">
                    {selectedLocation.mobile}
                  </p>
                </div>

                <div className="flex flex-col gap-2 lg:col-span-1">
                  <h5 className="text-xl font-bold text-white underline decoration-(--wwf-sea-green) underline-offset-4">
                    Email ID
                  </h5>
                  <p className="leading-relaxed wrap-break-word whitespace-pre-line text-white/90">
                    {selectedLocation.email}
                  </p>
                </div>

                {selectedLocation.address && (
                  <div className="flex flex-col gap-2 lg:col-span-1">
                    <h5 className="text-xl font-bold text-white underline decoration-(--wwf-sea-green) underline-offset-4">
                      Address
                    </h5>
                    <p className="leading-relaxed whitespace-pre-line text-white/90">
                      {selectedLocation.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </footer>

      <footer className="mt-auto w-full bg-black py-6 text-center text-sm text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p>
            Copyright &copy; {new Date().getFullYear()} WWF India All Rights
            Reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
