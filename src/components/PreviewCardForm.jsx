import React from "react";
import Logo from "../assets/images/Logo1.png";

const PreviewCardForm = ({ viewInput, selectedCompanyDetails, mode }) => {
  return (
    <div className="w-1/1 h-auto shadow-md bg-backgroundColor border  p-2 rounded-lg border-t-[5px] border-gray-400">
      <div className="w-[580px] bg-backgroundColor h-auto mt-2 ml-1 font-manrope " id="previewInvoice">
        <div className="w-[200px] h-[60px] ">
          <img className="w-auto h-auto object-fit" src={Logo} alt="" />
        </div>
        <div className="flex justify-between h-20 mt-4">
          <h2 className="font-bold text-[16px] w-20">
            Gefährdungsbeurteilung Mitwirkende
          </h2>
          <div className="w-[30%]">
            <h2 className="font-bold text-[12px]">
              Erstellt: {viewInput.datum.substring(0,10)}
            </h2>
            <h2 className="font-bold text-[12px]">Stand: {viewInput.datum.substring(0,10)}</h2>
          </div>
        </div>
        <table className="table  border rounded-lg border-gray-300 w-full table-fixed">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200">
                Kategorie
              </th>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Firma
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Emrush Kadrija Metall & Schrotthandel Gaußstr 38 47441 Moers
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Betrieb/Betriebsteil
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.selectedCompany}
                {viewInput.companyName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Kundenadresse
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Kundenadresse}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Tätigkeit/Funktion/Person
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Person}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Arbeitsbereich
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Arbeitsbereich}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Geschäftsleitung
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Geschaftsleitung}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Die Gefährdungsbeurteilung wurde geleitet von: An der
                Gefährdungsbeurteilung warn beteiligt:
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Gefahrdungsbeurteilung}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Führungskraft
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Fuhrungskraft}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Mitarbeiter
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Mitarbeiter}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Sicherheitsbeauftragte
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Sicherheitsbeauftragte}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Betriebsrat
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Betriebsrat}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Fachkraft für Arbeitssicherheit
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Arbeitssicherheit}
              </td>
            </tr>

            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Betriebsarzt
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Betriebsarzt}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Berufsgenossenschaft
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Berufsgenossenschaft}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Staatliche Behörde:
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Staatliche}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                Anlagen
              </td>
              <td className="border border-gray-300 px-4 py-2 text-[14px]">
                {viewInput.Anlagen}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewCardForm;
