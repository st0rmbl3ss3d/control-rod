import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { severity, type finding } from '~/shared/finding';
import { api } from '~/utils/api';
import { useAtom } from 'jotai';
import { atomSearch } from '~/shared/atoms';
import { createCompareFn } from '~/shared/helpers';

function createFilterFn<T extends finding>(query: string) {
  const filterFn = (f: finding, index: number, array: finding[]) => {
    const lowerQuery = query.toLowerCase();
    return (
      //inexplicably, one of the findings had no description, so check for all params before doing string compares
      (f.name && f.name.toLowerCase().includes(lowerQuery)) ||
      (f.host && f.host.includes(lowerQuery)) ||
      (f.severity && severity[f.severity].toLowerCase().includes(lowerQuery)) ||
      (f.description && f.description.toLowerCase().includes(lowerQuery)) ||
      (f.template && f.template.includes(lowerQuery))
    );
  };
  return filterFn;
}

const Home: NextPage = () => {
  const [search] = useAtom(atomSearch);
  const { data: findings, status: findingsStatus } =
    api.findings.getFindings.useQuery();
  return (
    <>

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex h-full w-full flex-col text-white">
          <table className="table-auto">
            <thead className="borderb border-collapse border-gray-600 bg-white/10">
              <tr className="border border-gray-600">
                <th className="border border-gray-600">Finding</th>
                <th className="border border-gray-600">Severity</th>
                <th className="border border-gray-600">Host</th>
                <th className="border border-gray-600">Description</th>
                <th className="border border-gray-600">Template</th>
              </tr>
            </thead>
            <tbody>
              {findings &&
                findings
                  .sort(createCompareFn('severity', 'desc'))
                  .filter(createFilterFn(search))
                  .map((f) => (
                    <tr className="even:bg-white/5 " key={f.timestamp}>
                      <td className="border border-y-0 border-l-0 border-gray-700">
                        {f.name}
                      </td>
                      <td className=" border border-y-0 border-l-0 border-gray-700 ">
                        <span
                          className={`${
                            f.severity == severity.critical
                              ? 'm-2 rounded bg-red-400 p-2'
                              : ''
                          }
                        ${
                          f.severity == severity.high
                            ? 'm-2 rounded bg-orange-400 p-2'
                            : ''
                        }
                        ${
                          f.severity == severity.medium
                            ? 'm-2 rounded bg-yellow-400 p-2 text-black'
                            : ''
                        }
                         ${
                           f.severity == severity.low
                             ? 'm-2 rounded bg-green-400 p-2'
                             : ''
                         }
                            ${
                              f.severity == severity.info
                                ? 'm-2 rounded bg-white p-2 text-black'
                                : ''
                            }
                         `}
                        >
                          {severity[f.severity]}
                        </span>
                      </td>
                      <td className="border border-y-0 border-l-0 border-gray-700">
                        {f.host}
                      </td>
                      <td className="border border-y-0 border-l-0 border-gray-700">
                        {f.description}
                      </td>
                      <td className="border border-y-0 border-l-0 border-gray-700">
                        {f.template}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {findingsStatus && findingsStatus == 'loading' && (
          <button
            type="button"
            className="inline-flex cursor-not-allowed items-center rounded-md  bg-indigo-400 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out"
            disabled
          >
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </button>
        )}
        <div className="flex flex-col items-center gap-2">
          <AuthShowcase />
        </div>
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
    </div>
  );
};
