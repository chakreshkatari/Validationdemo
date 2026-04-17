/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowLeft, Ticket, QrCode, Mail, ChevronRight, Info, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Html5Qrcode } from "html5-qrcode";
import { QRCodeSVG } from "qrcode.react";

// Pre-generate a fixed set of 100 random strings for the QR codes
const QR_BASE64_SET = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAANwSURBVO3BQa7cVgADweaD7n/ljhdZcCVgIM2P7bAq/sLMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPl4qEk/CSVloSm0pLwJpWWhKbSkvCTVJ44zJTDTDnMlIuXqbwpCW9SaUm4o/ImlTcl4U2HmXKYKYeZcvFlSfiEyhNJaCotCU3lv5SET6h802GmHGbKYaZc/OFUWhLelISm8jc7zJTDTDnMlIs/XBKayk9S+ZscZsphphxmysWXqXyTSktCU7mThKbSVL5J5XdymCmHmXKYKRcvS8JPSkJTaUloKi0Jd5LQVFoSmsqdJPzODjPlMFMOMyX+wl8kCU2lJaGptCQ0lZaEOyp/ssNMOcyUw0y5eCgJTeVOEr5JpSWhqbQkNJUnktBU7iShqbQkfELlicNMOcyUw0y5+LIkNJWWhKZyJwl3kvBEEprKHZVvUrmThDcdZsphphxmysWXqdxRaUm4o/JEEprKm5JwR+VOEu6oNJU3HWbKYaYcZkr8hQeS8E0qLQlNpSWhqbQkfEKlJeFNKneS8AmVJw4z5TBTDjPl4mUqLQl3VFoSWhLuJKGpPKHyhEpLQlO5k4Sm0pLwTYeZcpgph5lymCmHmXKYKxcuS8JPSkJTaUloKi0Jd5LQVFoSmsqdJPzODjPlMFMOM+UwUy5epnInCU3lE0loKi0JTeWbktBU7iShqdxRaUloKm86zJTDTDnMlIsvS8KdJHxTEp5IQlO5k4RPJOGJJDSVJw4z5TBTDjPl4iGVOyrflIQ7Ki0J36TyiSTcScJPOsyUw0w5zJSLh5Lwk1Q+kYQ7KndUWhI+kYSm8gmVloRvOsyUw0w5zJSLl6m8KQm/E5WWhDsqn1D5hMqbDjPlMFMOM+Xiy5LwCZU3qdxJQlNpSWgqd5LwRBI+kYSm8sRhphxmymGmXPzPJOEnqdxJwh2VO0l402GmHGbKYaZc/OFU7iShqTyRhDsqn1C5k4SfdJgph5lymCkXX6byk5LQVO4koak0lZaENyXhCZU3HWbKYaYcZkr8hQeS8JNUWhKaSktCU7mThDsqLQlvUmlJ+ITKE4eZcpgph5kSf2HmX4eZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5nyD3RiehMPwkKyAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAANtSURBVO3BQY7cSBAEQY8E//9lXx32kKcCCLJbmkGYxT+o+t9QtQxVy1C1DFXLULUMVctQtQxVy1C1DFXLULUMVctQtQxVy1C1XDyUhG9S2ZKwqTyRhBOVLQmbypaEb1J5YqhahqplqFouXqbypiS8KQl3qLxJ5U1JeNNQtQxVy1C1XHxYEu5Q+SaVvykJd6h80lC1DFXLULVc/HAqWxLuSMKmsiVhU/nNhqplqFqGquXih0vCicpJEp5Q+U2GqmWoWoaq5eLDVD5JZUvCm1Q+SeVfMlQtQ9UyVC0XL0vCNyVhU9mSsKnckYRNZUvCpnKShH/ZULUMVctQtcQ/+EWScIfKloRNZUvCicpPNlQtQ9UyVC0XDyVhUzlJwt+kcqLyRBI2lZMkbCpbEu5QeWKoWoaqZahaLl6WhBOVT0rCpnKShBOVE5U3JeFE5ZOGqmWoWoaq5eIhlS0Jm8qWhBOVLQmbypaETeUkCScqTyThROWJJJyoPDFULUPVMlQtFw8lYVM5UdmScKJyRxJOVE6SsKmcJOGOJGwqJ0nYVLYkvGmoWoaqZahaLh5SeVMSnlC5IwmbyhMqWxI2lTtUtiR80lC1DFXLULVcPJSEE5UnVLYkbCpvSsKmcqLymwxVy1C1DFXLxYcl4UTlJAl3JGFTuUNlS8Km8klJ+JuGqmWoWoaq5eJlKnckYVPZVE6SsKm8SeUkCZvKSRI2lTtUPmmoWoaqZahaLj4sCZvKSRKeSMKJyqZykoRN5SQJdyThROUkCZvKE0PVMlQtQ9US/+AHS8KJyiclYVO5IwlvUnliqFqGqmWoWi4eSsI3qZyo3JGET0rCpnKicpKETxqqlqFqGaqWi5epvCkJdyRhU9mScKKyJWFT2ZJwonJHEjaVE5U3DVXLULUMVcvFhyXhDpUnVLYk3JGEJ5LwhModSdhUnhiqlqFqGaqWi18mCScqJ0nYVJ5QOUnCloRNZVPZkvCmoWoZqpaharn44VTuSMKmsqmcJOFE5Q6VkyR801C1DFXLULVcfJjKNyXhRGVLwqayJeGTkvCEypuGqmWoWoaq5eJlSfimJJyonKjcobIlYUvCEypbEk6SsKk8MVQtQ9UyVC3xD6r+N1QtQ9UyVC1D1TJULUPVMlQtQ9UyVC1D1TJULUPVMlQtQ9UyVC3/AWy1dhFOl2FrAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOFSURBVO3BQQrk2AFEwZcf3f/Kz70YTK4EQlVl95AR8Q9m/nGYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgpFy8l4ZdUWhKayp0kNJWWhDsqLQlNpSXhl1TeOMyUw0w5zJSLD1P5pCQ8kYSm0lSeUPkklU9KwicdZsphphxmysWXJeEJlTdUWhKaSktCU/mlJDyh8k2HmXKYKYeZcvGXU2lJuJOEpnInCU3l3+wwUw4z5TBTLv5ySbij0pLQktBUnlD5NznMlMNMOcyUiy9T+SaVloSWhDsqd1S+SeX/yWGmHGbKYaZcfFgSfikJTaUloam0JDSVloSm0pLQVO4k4f/ZYaYcZsphpsQ/mP9KQlNpSbij8jc7zJTDTDnMlIuXktBU7iThm1TuJOGOyhtJaCp3ktBUWhKeUHnjMFMOM+UwUy5eUmlJaCpPqNxJQlN5QuVOEprKHZVfUmlJ+KTDTDnMlMNMufgxlZaEO0loKi0JT6i0JDSVN5JwR+VOEu4koal80mGmHGbKYaZcfFkS3lBpSXhCpSWhqbQkNJU7SXgiCU3lThKaSktCU3njMFMOM+UwUy6+TOVOEloS7qi0JLyRhKbyhkpLQlN5QqUl4ZsOM+UwUw4z5eKlJDyRhKbSktBU7qi0JNxRaUloSWgqd1S+KQl3VD7pMFMOM+UwUy6+LAlN5Ykk/JLKHZVfUrmThKbyxmGmHGbKYaZcfJjKGypvJOGNJNxRaUloKneS0FRaEppKS8I3HWbKYaYcZsrFjyXhjkpLQlNpSWgqLQl3VFoSmsoTSXgiCW+ofNJhphxmymGmXLyk8oTKEypvqPySyhNJaCpPJKGpvHGYKYeZcpgpFy8l4ZdU7iThjkpLwp0kvJGEpnInCf9Lh5lymCmHmXLxYSqflIQ3VFoSmsobSbij8k0qn3SYKYeZcpgpF1+WhCdUfikJT6jcScInqbQktCQ0lTcOM+UwUw4z5eJfLgl3VFoSmsobKneS8IRKS8InHWbKYaYcZsrFX07lThKaSkvCnSQ8ofKEyp0k/NJhphxmymGmXHyZyi8l4Q2VO0n4pCS8ofJJh5lymCmHmRL/4IUk/JJKS8IdlSeS0FTuJOGTVFoSnlB54zBTDjPlMFPiH8z84zBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFP+Ay3qixTJr3D8AAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOXSURBVO3BQY4cSQIDQWeg/v9lXx3mwFMAiazWSLM0i78w84/DTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNM+fBSEn4nlZaEptKS8ITKNyXhd1J54zBTDjPlMFM+fJnKNyXhiSQ0lZaEpvJGEprKjco3JeGbDjPlMFMOM+XDD0vCEypPqDyh0pLQVG6S8E1JeELlJx1mymGmHGbKh79cEm5UfpLKf8lhphxmymGmfPjLqdwkoak0lZsk/D85zJTDTDnMlA+/TOVPloQblZ+k8ic5zJTDTDnMlA9floTfKQlN5Q2VloSm0pLQVG6S8Cc7zJTDTDnMlPgLf7EkNJWflIQblb/ZYaYcZsphpnx4KQlNpSXhRqUl4QmVmyQ0lTdUWhJuktBUbpLQVFoSblTeOMyUw0w5zJQP/7Ik3Ki0JNwk4SYJTaUl4UblCZUnVFoSfqfDTDnMlMNM+fCSyhsqLQktCTdJuFG5SUJTeUKlJaGp3CShqdyotCR802GmHGbKYaZ8+LIkNJU3VFoSmkpLwk0S3kjCjcoTKi0JN0loKt90mCmHmXKYKR9eSkJTuUnCjUpLQlNpSWgqLQlNpSWhJeEJlZaEb1K5SUJTeeMwUw4z5TBTPryk0pJwo3KThKbSkvBGEppKS8I3qbQkNJWWhCdUvukwUw4z5TBTPvwwlZaEpnKThKZyk4Sm8oRKS8ITKjcqf7LDTDnMlMNM+fBSEppKS8JNEm5UnlB5Igk3Ki0JTyThCZUnktBU3jjMlMNMOcyUDy+pPKHSktBUWhJuVG6S0FSayhtJ+C85zJTDTDnMlPgLf7EkNJWbJLyh0pLQVJ5IQlP5Nx1mymGmHGbKh5eS8DupPJGEN1RaEp5IQlO5ScKNSktCU3njMFMOM+UwUz58mco3JeGJJDSVJ5LQktBUWhJuVN5Q+Z0OM+UwUw4z5cMPS8ITKk+ovJGEJ5Jwk4RvSsKNyjcdZsphphxmyoe/XBKaSktCU7lRaUm4UWlJaCpvJKGptCQ0lTcOM+UwUw4z5cN/TBKayo1KS0JTuUlCU2lJaCo3SbhJQlP5psNMOcyUw0z58MNUfpLKTRJuVG6S8EQSbpLwhkpLQlN54zBTDjPlMFM+fFkSfqck3Ki0JLyh8kQSmsqf7DBTDjPlMFPiL8z84zBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFP+B3YQjike1sepAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOZSURBVO3BQY4jSQIDQWdA//+ybx/mwFMAQkrVU7M0i38w84/DTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNMefFQEn6SSkvCEyotCTcqLQlNpSXhJ6k8cZgph5lymCkvPkzlk5Jwo9KS8IRKS8InqXxSEj7pMFMOM+UwU158WRLeofKOJDSV3yQJ71D5psNMOcyUw0x58cuptCQ8odJUblT+Sw4z5TBTDjPlxX+cyjuScKPSktBUfrPDTDnMlMNMefFlKt+UhCeS0FR+ksq/yWGmHGbKYaa8+LAk/E0qLQlN5R1JaCpPJOHf7DBTDjPlMFPiH/wfSUJTuUnCO1R+s8NMOcyUw0x58VASmkpLQlN5RxJuVH6TJDSVmyQ0lZaEpvLEYaYcZsphprx4SOWJJNyo3CShqdyotCR8UxKayhNJ+KbDTDnMlMNMefFhSWgqLQlN5SYJTeUmCU3lCZWWhJsk3CThHSotCd90mCmHmXKYKS8eSkJTuVFpSWgqTaUl4R1J+CaVdyShqbQk3Ki0JHzSYaYcZsphprz4siQ0laZyk4QblSeS0FTekYSm0pLQVG5UWhJ+0mGmHGbKYaa8eEilJaGptCQ0lZaEptKScJOEpnKj0pLQVG5UblRaEm5UmkpLwjcdZsphphxmyouHkvBJKi0JN0loKjdJuFFpSWgqN0m4UWlJaEloKk3lmw4z5TBTDjMl/sEXJeFG5ZOScKNyk4Sm8klJeEKlJaGpPHGYKYeZcpgpLx5Kwo3KTRKaSkvCEyotCTcqLQlNpSXhb1L5pMNMOcyUw0x58ZDKEyo3KjdJaCotCe9IwhMq70hCU2lJ+EmHmXKYKYeZ8uKhJPwklZskNJWbJDSVloSWhHckoam8Q6Ul4UblicNMOcyUw0x58WEqn5SEG5WbJLwjCTcqLQk3Ku9Iwt90mCmHmXKYKS++LAnvUPkklZaEptKS0FTekYRvUmlJ+KTDTDnMlMNMefEfk4Sm8g6VloSm0lRaEm5UbpLwDpVPOsyUw0w5zJQXv1wSmso7knCj0pLQVJrKTRKaSlO5ScKNyhOHmXKYKYeZ8uLLVL5J5QmVloQnknCj0pJwo9JUWhI+6TBTDjPlMFNefFgSflIS3qHyjiQ0lZaEdyThRqUl4ScdZsphphxmSvyDmX8cZsphphxmymGmHGbKYaYcZsphphxmymGmHGbKYaYcZsphphxmyv8AFxWXHXyhQE0AAAAASUVORK5CYII="
];

type MainTab = "trips" | "passes";
type SubTab = "upcoming" | "active" | "expired" | "completed";
type View = "list" | "details" | "loading" | "scan";

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>("passes");
  const [subTab, setSubTab] = useState<SubTab>("active");
  const [view, setView] = useState<View>("list");
  const [selectedBus, setSelectedBus] = useState("KA57F");
  const [busDigits, setBusDigits] = useState<string[]>(["", "", "", ""]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastValidatedTime, setLastValidatedTime] = useState<string>(() => {
    return localStorage.getItem("lastValidatedTime") || "13 Apr 2026, 09:48 am";
  });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [qrIndex, setQrIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("lastValidatedTime", lastValidatedTime);
  }, [lastValidatedTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQrIndex((prevIndex) => (prevIndex + 1) % QR_BASE64_SET.length);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (view === "scan") {
      const html5QrCode = new Html5Qrcode("camera-placeholder");
      
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrCode.stop().then(() => {
            setLastValidatedTime(getCurrentDateTime());
            setView("list");
            setMainTab("passes");
            setSubTab("active");
            setShowSuccessModal(true);
            setBusDigits(["", "", "", ""]);
            setShowKeyboard(false);
          }).catch(console.error);
        },
        (error) => {
          // Ignore scanning errors
        }
      ).catch(console.error);

      return () => {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch(console.error);
        }
      };
    }
  }, [view]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const isContentVisible = mainTab === "passes" && subTab === "active";

  const handleNoActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // No action performed
  };

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    if (view === "details" || view === "loading" || view === "scan") {
      setTimeout(() => setView("list"), 100); // Small delay to let ripple start
      return;
    }
    handleNoActionClick(e);
  };

  const renderLoadingView = () => {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center" id="loading-view">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
          id="loading-spinner"
        />
        <p className="text-gray-600 text-lg font-medium" id="loading-text">Loading... Please wait</p>
      </div>
    );
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' });
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };

  const renderDetailsView = () => {
    return (
      <div className="flex-1 bg-[#f0f4f7] flex flex-col overflow-y-auto" id="details-view">
        {/* Pass Info Card */}
        <div className="p-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100" id="pass-info-card">
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#1a2a3a]/10 flex items-center justify-center p-1" id="logo-container">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img src="data:image/jpeg;base64,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" alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-medium text-gray-800 mb-2" id="details-pass-title">Ordinary Weekly Pass</h2>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#e8f5e9] text-[#4caf50] px-3 py-0.5 rounded text-xs font-bold uppercase" id="badge-weekly">Weekly</span>
                  <span className="bg-[#eeeeee] text-[#424242] px-3 py-0.5 rounded text-xs font-bold uppercase" id="badge-ordinary">Ordinary</span>
                </div>
                <p className="text-gray-400 text-sm font-medium" id="details-pass-id">Pass ID: TPASS790137649626201</p>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 my-4"></div>
            
            <button 
              onClick={() => setView("scan")}
              className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-lg py-3 flex items-center justify-center gap-2 font-bold mb-4 shadow-sm transition-all active:scale-95"
              id="scan-qr-button"
            >
              <QrCode className="w-5 h-5" />
              <span>Scan QR</span>
            </button>

            <button 
              onClick={() => setView("loading")}
              className="w-full flex items-center justify-center gap-2 text-[#00bcd4] font-medium text-sm hover:opacity-80 transition-opacity"
              id="how-to-validate-link"
            >
              <Info className="w-4 h-4" />
              <span>How to Validate Your Pass?</span>
            </button>
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="px-4 pb-4">
          <h3 className="text-gray-700 font-bold mb-3 px-1" id="booking-details-header">Booking Details</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative" id="booking-details-card">
            <div className="space-y-5">
              <div id="field-passenger">
                <p className="text-gray-400 text-sm font-medium mb-1">Passenger name</p>
                <p className="text-gray-700 text-lg font-bold">K Chakresh</p>
              </div>
              <div id="field-id-type">
                <p className="text-gray-400 text-sm font-medium mb-1">Identification type</p>
                <p className="text-gray-700 text-lg font-bold">Aadhar Card</p>
              </div>
              <div id="field-id-number">
                <p className="text-gray-400 text-sm font-medium mb-1">Identification number (Last 4 digits)</p>
                <p className="text-gray-700 text-lg font-bold">8657</p>
              </div>
              <div id="field-purchase-date">
                <p className="text-gray-400 text-sm font-medium mb-1">Pass purchase date</p>
                <p className="text-gray-700 text-lg font-bold">13 Apr 2026, 07:12 AM</p>
              </div>
              <div id="field-valid-from">
                <p className="text-gray-400 text-sm font-medium mb-1">Pass valid from</p>
                <p className="text-gray-700 text-lg font-bold">13 Apr 2026, 12:00 AM</p>
              </div>
              <div className="flex justify-between items-end" id="field-valid-till-container">
                <div id="field-valid-till">
                  <p className="text-gray-400 text-sm font-medium mb-1">Pass valid till</p>
                  <p className="text-gray-700 text-lg font-bold">19 Apr 2026, 11:59 PM</p>
                </div>
                <div className="text-right" id="fare-container">
                  <p className="text-gray-400 text-xs font-medium underline mb-1">Pass fare</p>
                  <p className="text-gray-700 text-2xl font-bold">₹ 350</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setView("loading")}
                className="bg-[#a3cf62] hover:bg-[#92ba58] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-all active:scale-95"
                id="generate-mail-receipt-button"
              >
                <Mail className="w-4 h-4" />
                Generate mail receipt
              </button>
            </div>
          </div>
        </div>

        {/* Last Validated Section */}
        <div className="px-4 mb-6">
          <div className="bg-[#f1f8e9] rounded-xl p-4 border border-[#dcedc8] shadow-sm" id="last-validated-section">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-500 font-medium">Last Validated</span>
              <span className="text-gray-700 font-bold">{lastValidatedTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Validated By</span>
              <span className="text-gray-700 font-bold">Conductor</span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center px-4 mb-8" id="qr-code-section">
          <div className="bg-white shadow-md border border-gray-100 relative" id="qr-code-container">
            <div className="w-56 h-56 flex items-center justify-center">
              <img 
                src={QR_BASE64_SET[qrIndex]} 
                className="w-full h-full object-contain"
                alt="QR Code"
              />
            </div>
            {/* Small logo in center of QR */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img src="data:image/jpeg;base64,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" alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            {/* Fake bottom-right QR position locator overlay to match standard marker */}
            <div className="absolute bottom-0 right-0 border-t-8 border-l-8 border-white bg-black flex items-center justify-center z-10" style={{ width: '23.5%', height: '23.5%' }}>
              <div className="bg-white flex items-center justify-center" style={{ width: '70%', height: '70%' }}>
                <div className="bg-black" style={{ width: '40%', height: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms of Use Footer */}
        <div className="mt-auto p-4 border-t border-gray-200 bg-white">
          <button 
            onClick={() => setView("loading")}
            className="w-full flex items-center justify-between group"
            id="terms-of-use-button"
          >
            <div className="text-left">
              <p className="text-gray-500 font-bold text-sm mb-1">Terms of Use</p>
              <p className="text-gray-400 text-xs">Click to read the terms and conditions for this pass.</p>
            </div>
            <div className="bg-[#fff176] p-1 rounded-full text-gray-700 group-hover:scale-110 transition-transform">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderScanView = () => {
    const busNumbers = ["KA57F", "KA57FA", "KA51A", "KA51AK", "KA41A", "KA01F", "KA51AJ", "KA51AH"];

    const handleKeyPress = (key: string) => {
      const nextEmptyIndex = busDigits.findIndex(d => d === "");
      if (nextEmptyIndex !== -1) {
        const newDigits = [...busDigits];
        newDigits[nextEmptyIndex] = key;
        setBusDigits(newDigits);
        
        // If this was the 4th digit, show success modal and go back to list
        if (nextEmptyIndex === 3) {
          setLastValidatedTime(getCurrentDateTime());
          setTimeout(() => {
            setView("list");
            setMainTab("passes");
            setSubTab("active");
            setShowSuccessModal(true);
            setBusDigits(["", "", "", ""]);
            setShowKeyboard(false);
          }, 300);
        }
      }
    };

    const handleDelete = () => {
      const lastFilledIndex = [...busDigits].reverse().findIndex(d => d !== "");
      if (lastFilledIndex !== -1) {
        const actualIndex = 3 - lastFilledIndex;
        const newDigits = [...busDigits];
        newDigits[actualIndex] = "";
        setBusDigits(newDigits);
      }
    };

    return (
      <div className="flex-1 bg-black flex flex-col relative overflow-hidden" id="scan-view">
        {/* Camera View Area */}
        <div className="flex-1 w-full h-full" id="camera-placeholder"></div>

        {/* Floating Tooltip */}
        <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[90%] z-10" id="scan-tooltip">
          <div className="bg-[#d0e1f9] text-[#2c5282] px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg relative">
            <div className="w-8 h-8 bg-[#2c5282]/10 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-[#2c5282]" />
            </div>
            <p className="text-sm font-medium">Enter bus number or Scan QR to validate</p>
            {/* Tooltip arrow */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-[#d0e1f9] rotate-45"></div>
          </div>
        </div>

        {/* Bottom Sheet */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="bg-white rounded-t-[32px] p-6 pb-4 shadow-2xl z-20 mt-auto"
          id="scan-bottom-sheet"
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          <h3 className="text-2xl font-bold text-[#2d3748] mb-6" id="bottom-sheet-title">Enter bus number</h3>
          
          <div className="flex flex-wrap gap-3 mb-8" id="bus-number-chips">
            {busNumbers.map((bus) => (
              <button
                key={bus}
                onClick={() => setSelectedBus(bus)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedBus === bus 
                    ? "bg-[#a3cf62] border-[#a3cf62] text-white" 
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
                id={`chip-${bus}`}
              >
                {bus}
              </button>
            ))}
          </div>

          <div className="flex gap-4 justify-between px-2 mb-8" id="bus-number-inputs">
            {busDigits.map((digit, i) => (
              <div 
                key={i}
                onClick={() => setShowKeyboard(true)}
                className={`flex-1 aspect-square rounded-xl border flex items-center justify-center text-2xl font-bold text-[#2d3748] transition-all cursor-pointer ${
                  showKeyboard && busDigits.findIndex(d => d === "") === i
                    ? "bg-white border-[#a3cf62] ring-2 ring-[#a3cf62]/20"
                    : "bg-gray-200/50 border-gray-200"
                }`}
                id={`input-box-${i}`}
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Integrated Numeric Keyboard */}
          <AnimatePresence>
            {showKeyboard && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
                id="integrated-keyboard"
              >
                <div className="bg-[#d1d5db] -mx-6 -mb-4 p-2 grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleKeyPress(num.toString())}
                      className="bg-white hover:bg-gray-50 active:bg-gray-200 h-14 rounded-lg shadow-sm text-2xl font-medium flex items-center justify-center transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <div className="h-14" /> {/* Empty space */}
                  <button
                    onClick={() => handleKeyPress("0")}
                    className="bg-white hover:bg-gray-50 active:bg-gray-200 h-14 rounded-lg shadow-sm text-2xl font-medium flex items-center justify-center transition-colors"
                  >
                    0
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-white/50 hover:bg-white/70 active:bg-white/90 h-14 rounded-lg shadow-sm flex items-center justify-center transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Backdrop to close keyboard */}
        <AnimatePresence>
          {showKeyboard && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyboard(false)}
              className="absolute inset-0 bg-black/20 z-10"
              id="keyboard-backdrop"
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderSubTabs = () => {
    if (mainTab === "trips") {
      return (
        <div className="flex justify-around p-4 bg-white border-b border-gray-100">
          <button 
            onClick={() => setSubTab("active")}
            className={`px-8 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
              subTab === "active" 
                ? "bg-[#a3cf62] text-white shadow-sm" 
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
            id="trips-active-tab"
          >
            Active
          </button>
          <button 
            onClick={() => setSubTab("completed")}
            className={`px-6 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
              subTab === "completed" 
                ? "bg-[#a3cf62] text-white shadow-sm" 
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
            id="trips-completed-tab"
          >
            Completed
          </button>
          <button 
            onClick={() => setSubTab("expired")}
            className={`px-6 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
              subTab === "expired" 
                ? "bg-[#a3cf62] text-white shadow-sm" 
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
            id="trips-expired-tab"
          >
            Expired
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-around p-4 bg-white border-b border-gray-100">
        <button 
          onClick={() => setSubTab("upcoming")}
          className={`px-6 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
            subTab === "upcoming" 
              ? "bg-[#a3cf62] text-white shadow-sm" 
              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
          id="passes-upcoming-tab"
        >
          Upcoming
        </button>
        <button 
          onClick={() => setSubTab("active")}
          className={`px-8 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
            subTab === "active" 
              ? "bg-[#a3cf62] text-white shadow-sm" 
              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
          id="passes-active-tab"
        >
          Active
        </button>
        <button 
          onClick={() => setSubTab("expired")}
          className={`px-6 py-2 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
            subTab === "expired" 
              ? "bg-[#a3cf62] text-white shadow-sm" 
              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
          id="passes-expired-tab"
        >
          Expired
        </button>
      </div>
    );
  };

  const renderSuccessModal = () => {
    return (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6" id="success-modal-overlay">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl"
          id="success-modal-card"
        >
          <div className="p-8 flex flex-col items-center">
            {/* Green Checkmark Badge */}
            <div className="w-24 h-24 flex items-center justify-center mb-6 relative">
              {/* Scalloped Outer Ring */}
              <motion.svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full text-[#a5d6a7] fill-current"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <path d="M94,50 A6,6 0 0,1 93.15,58.58 A6,6 0 0,1 90.65,66.83 A6,6 0 0,1 86.59,74.43 A6,6 0 0,1 81.11,81.11 A6,6 0 0,1 74.43,86.59 A6,6 0 0,1 66.83,90.65 A6,6 0 0,1 58.58,93.15 A6,6 0 0,1 50,94 A6,6 0 0,1 41.42,93.15 A6,6 0 0,1 33.17,90.65 A6,6 0 0,1 25.57,86.59 A6,6 0 0,1 18.89,81.11 A6,6 0 0,1 13.41,74.43 A6,6 0 0,1 9.35,66.83 A6,6 0 0,1 6.85,58.58 A6,6 0 0,1 6,50 A6,6 0 0,1 6.85,41.42 A6,6 0 0,1 9.35,33.17 A6,6 0 0,1 13.41,25.57 A6,6 0 0,1 18.89,18.89 A6,6 0 0,1 25.57,13.41 A6,6 0 0,1 33.17,9.35 A6,6 0 0,1 41.42,6.85 A6,6 0 0,1 50,6 A6,6 0 0,1 58.58,6.85 A6,6 0 0,1 66.83,9.35 A6,6 0 0,1 74.43,13.41 A6,6 0 0,1 81.11,18.89 A6,6 0 0,1 86.59,25.57 A6,6 0 0,1 90.65,33.17 A6,6 0 0,1 93.15,41.42 A6,6 0 0,1 94,50 Z" />
              </motion.svg>
              
              {/* Solid Forest Green Center */}
              <div className="w-16 h-16 bg-[#2e7d32] rounded-full flex items-center justify-center shadow-lg z-10">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M4 12l5 5"
                    initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 1, 1, 1, 1, 1], 
                      pathOffset: [0, 0, 0, 1, 1, 1],
                      opacity: [0, 1, 1, 1, 0, 0] 
                    }}
                    transition={{
                      duration: 1.5,
                      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.path
                    d="M9 17l11 -11"
                    initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 0, 1, 1, 1, 1], 
                      pathOffset: [0, 0, 0, 0, 1, 1],
                      opacity: [0, 0, 1, 1, 1, 0] 
                    }}
                    transition={{
                      duration: 1.5,
                      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-[#2e7d32] text-2xl font-bold text-center leading-tight mb-8" id="success-modal-title">
              Self verification done successfully
            </h2>

            <div className="w-full space-y-4 mb-8" id="success-modal-details">
              <div className="flex justify-between items-start text-sm">
                <span className="text-gray-500 font-medium">Pass number</span>
                <span className="text-gray-800 font-bold text-right ml-4">TPASS790137649626201</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Pass type</span>
                <span className="text-gray-800 font-bold">weekly</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Pass valid till</span>
                <span className="text-gray-800 font-bold">19 Apr 2026, 11:59 PM</span>
              </div>
              
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-gray-800 font-bold">Pass fare</span>
                <span className="text-gray-800 font-bold text-xl">₹ 350</span>
              </div>
            </div>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#1a2a3a] hover:bg-[#2c3e50] text-white font-bold py-3.5 rounded-lg transition-colors shadow-md active:scale-95"
              id="success-modal-ok-button"
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a1a1a]">
      {showSuccessModal && renderSuccessModal()}
      {/* Header and Tabs */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-[#0f2d2e] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={handleBackClick}
              className="relative p-2 hover:bg-white/10 rounded-full transition-all active:scale-95 cursor-pointer overflow-hidden"
              id="back-button"
            >
              <AnimatePresence>
                {ripples.map((ripple) => (
                  <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: ripple.y,
                      left: ripple.x,
                      width: ripple.size,
                      height: ripple.size,
                      backgroundColor: "rgba(255, 255, 255, 0.4)",
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  />
                ))}
              </AnimatePresence>
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            {view === "list" ? (
              <div className="flex gap-8 text-lg font-medium">
                <div className="relative">
                  <button 
                    onClick={() => {
                      setMainTab("trips");
                      setSubTab("active");
                    }}
                    className={`transition-opacity cursor-pointer ${mainTab === "trips" ? "opacity-100" : "opacity-80 hover:opacity-100"}`} 
                    id="trips-tickets-tab"
                  >
                    Trips/Tickets
                  </button>
                  {mainTab === "trips" && (
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-[#a3cf62]"></div>
                  )}
                </div>
                <div className="relative">
                  <button 
                    onClick={() => {
                      setMainTab("passes");
                      setSubTab("active");
                    }}
                    className={`transition-opacity cursor-pointer ${mainTab === "passes" ? "opacity-100" : "opacity-80 hover:opacity-100"}`} 
                    id="passes-tab"
                  >
                    Passes
                  </button>
                  {mainTab === "passes" && (
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-[#a3cf62]"></div>
                  )}
                </div>
              </div>
            ) : view === "details" ? (
              <h1 className="text-xl font-medium" id="details-header-title">Your Bus Pass</h1>
            ) : view === "scan" ? (
              <h1 className="text-xl font-medium" id="scan-header-title">Scan QR</h1>
            ) : null}
          </div>
          {view === "details" && (
            <button 
              onClick={() => setView("loading")}
              className="text-white font-medium hover:opacity-80 transition-opacity"
              id="support-button"
            >
              Support
            </button>
          )}
        </div>

        {/* Sub-tabs (Only in list view) */}
        {view === "list" && renderSubTabs()}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {view === "loading" ? (
          renderLoadingView()
        ) : view === "scan" ? (
          renderScanView()
        ) : view === "details" ? (
          renderDetailsView()
        ) : isContentVisible ? (
          <>
            {/* Pass Card Container */}
            <div className="p-4 flex-1 bg-[#f9f9f9]">
              <div 
                onClick={() => setView("details")}
                className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #1a2a3a 0%, #2196f3 100%)'
                }}
                id="pass-card"
              >
                <div className="flex gap-2 items-start mb-4">
                  <span className="bg-white text-[#1a2a3a] px-3 py-1 rounded-full text-xs font-medium" id="pass-type-badge-ordinary">
                    Ordinary
                  </span>
                  <span className="bg-[#e8f5e9] text-[#4caf50] px-3 py-1 rounded-full text-xs font-medium" id="pass-type-badge-weekly">
                    Weekly
                  </span>
                  <span className="text-2xl font-semibold flex items-center gap-1 ml-auto" id="pass-price">
                    <span className="text-xl">₹</span> 350
                  </span>
                </div>
                
                <div 
                  className="text-3xl font-medium mb-8 text-left block w-full group-hover:opacity-90 transition-opacity" 
                  id="pass-title-button"
                >
                  Ordinary Weekly Pass
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-sm opacity-90 font-medium">Pass valid till</p>
                    <p className="text-lg font-bold" id="pass-expiry">19 Apr 2026, 11:59 PM</p>
                  </div>
                  <div 
                    className="bg-white/20 group-hover:bg-white/30 text-white p-3 rounded-xl transition-all active:scale-95"
                    id="pass-action-chevron"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="p-6 bg-white border-t border-gray-100 flex flex-col items-center gap-6">
              <p className="text-xl font-medium text-gray-700" id="purchase-prompt">
                Looking for pass purchase?
              </p>
              <button 
                onClick={() => setView("loading")}
                className="w-full bg-[#17a2b8] hover:bg-[#138496] text-white py-4 rounded-xl flex items-center justify-center gap-3 text-xl font-bold shadow-lg transition-all active:scale-[0.98]"
                id="book-new-pass-button"
              >
                <Ticket className="w-6 h-6 rotate-45" />
                Book a new pass
              </button>
            </div>
          </>
        ) : (
          /* Empty State Page Content */
          <div className="flex-1 bg-[#f9f9f9] p-4 flex flex-col items-center justify-start pt-12" id="empty-state-container">
            <div className="bg-white rounded-xl p-12 w-full max-w-md shadow-sm border border-gray-100 flex flex-col items-center text-center">
              {/* Character Illustration Placeholder */}
              <div className="relative w-48 h-24 mb-8" id="empty-state-illustration">
                {/* The "Hole" */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-[100%]"></div>
                {/* The Character (Simplified SVG) */}
                <svg viewBox="0 0 100 60" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-20 overflow-visible">
                  <defs>
                    <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#26a69a" />
                      <stop offset="50%" stopColor="#4db6ac" />
                      <stop offset="90%" stopColor="#cddc39" />
                      <stop offset="100%" stopColor="#f0f4c3" />
                    </linearGradient>
                    <filter id="eyeShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
                      <feOffset dx="0" dy="1" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Helmet Body (Shorter and wider) */}
                  <path d="M10,60 C10,20 30,5 50,5 C70,5 90,20 90,60 Z" fill="#000000" />
                  <path d="M15,60 C15,25 30,15 50,15 C70,15 85,25 85,60 Z" fill="#424242" />
                  
                  {/* Goggles (Positioned lower on the shorter helmet) */}
                  <g transform="translate(0, 2)">
                    <circle cx="42" cy="18" r="9" fill="#000" />
                    <circle cx="58" cy="18" r="9" fill="#000" />
                    <circle cx="42" cy="18" r="6.5" fill="#b2dfdb" />
                    <circle cx="58" cy="18" r="6.5" fill="#b2dfdb" />
                  </g>

                  {/* Face Area (Squat shape) */}
                  <path d="M25,60 C25,35 35,30 50,30 C65,30 75,35 75,60 Z" fill="url(#faceGrad)" />
                  
                  {/* Eyes (With gap in between) */}
                  <g filter="url(#eyeShadow)">
                    <circle cx="40" cy="48" r="10" fill="white" />
                    <circle cx="60" cy="48" r="10" fill="white" />
                    <circle cx="40" cy="48" r="4" fill="#000" />
                    <circle cx="60" cy="48" r="4" fill="#000" />
                    <circle cx="38.5" cy="46.5" r="1.2" fill="white" />
                    <circle cx="58.5" cy="46.5" r="1.2" fill="white" />
                  </g>
                  
                  {/* Nose/Beak (Larger, curved triangular shape) */}
                  <path d="M46,58 Q50,56 54,58 Q50,63 46,58 Z" fill="white" />
                </svg>
              </div>

              <h3 className="text-2xl font-medium mb-4" id="empty-state-title">
                " Uh - oh "
              </h3>
              <p className="text-gray-400 text-lg" id="empty-state-message">
                {mainTab === "trips" ? "Couldn't find any trips history" : "Couldn't find any pass history"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
