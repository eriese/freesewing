import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { isDegreeMeasurement } from '../../../config/measurements'
import { measurementAsMm } from 'shared/utils'

/*
 * This is a single input for a measurements
 * Note that it keeps local state with whatever the user types
 * but will only trigger a gist update if the input is valid.
 *
 * m holds the measurement name. It's just so long to type
 * measurement and I always have some typo in it because dyslexia.
 */
const MeasurementInput = ({ m, gist, app, updateMeasurements, focus, showDoc=true, gistMeasurement, size="lg", validate=true }) => {
  const { t } = useTranslation(['app', 'measurements'])

const prefix = (app?.site === 'org') ? '' : 'https://freesewing.org'
  const title = t(`measurements:${m}`)

  const isDegree = isDegreeMeasurement(m);
  const factor = useMemo(() => (isDegree ? 1 : (gist.units == 'imperial' ? 25.4 : 10)), [gist.units])

  const isValValid = val => (typeof val === 'undefined' || val === '')
      ? null
      : val != false && !isNaN(val)
  const isValid = (newVal) => (typeof newVal === 'undefined')
    ? isValValid(val)
    : isValValid(newVal)

  const [val, setVal] = useState(gistMeasurement && gistMeasurement / factor || '')

  // keep a single reference to a debounce timer
  const debounceTimeout = useRef(null);
  const input = useRef(null);

  // onChange
  const update = useCallback((evt) => {
    evt.stopPropagation();
    let evtVal = evt.target.value;
    // set Val immediately so that the input reflects it
    setVal(evtVal)

    let useVal = isDegree ? evtVal : measurementAsMm(evtVal, gist.units);
    const ok = isValid(useVal)
    // only set to the gist if it's valid
    if (ok) {
      // debounce in case it's still changing
    if (debounceTimeout.current !== null) { clearTimeout(debounceTimeout.current); }
      debounceTimeout.current = setTimeout(() => {
         // clear the timeout reference
        debounceTimeout.current = null;
        updateMeasurements(useVal, m)
      }, 500);
    }
  }, [gist.units])

  // track validity against the value and the units
  const valid = useMemo(() => isValid(isDegree ? val : measurementAsMm(val, gist.units)), [val, gist.units])

  // hook to update the value or format when the gist changes
  useEffect(() => {
      // set the value to the proper value and format
      if (gistMeasurement) {
        let gistVal = +(gistMeasurement / factor).toFixed(2);
        setVal(gistVal)
      }
  }, [gistMeasurement, factor])

  // focus when prompted by parent
  useEffect(() => {
    if (focus) {
      input.current.focus();
    }
  }, [focus])

  // cleanup
  useEffect(() => {
    clearTimeout(debounceTimeout.current)
  }, [])

  if (!m) return null

  return (
    <div className="form-control mb-2" key={`wrap-${m}`}>
      <label className="label">
        <span className="label-text font-bold text-xl">{title}</span>
        { showDoc && (<a
          href={`${prefix}/docs/measurements/${m.toLowerCase()}`}
          className="label-text-alt text-secondary hover:text-secondary-focus hover:underline"
          title={`${t('docs')}: ${t(m)}`}
          tabIndex="-1"
        >
          {t('docs')}
        </a>)}
      </label>
      <label className={`input-group input-group-${size}`}>
        <input
          key={`input-${m}`}
          ref={input}
          type="text"
          placeholder={title}
          className={`
            input input-${size} input-bordered grow text-base-content border-r-0
            ${validate && valid === false && 'input-error'}
            ${validate && valid === true && 'input-success'}
          `}
          value={val}
          onChange={update}
        />
        {validate ? (<span role="img" className={`bg-transparent border-y
            ${valid === false && 'border-error text-neutral-content'}
            ${valid === true && 'border-success text-neutral-content'}
            ${valid === null && 'border-base-200 text-base-content'}
         `}>
            {(valid === true) && '👍'}
            {(valid === false) && '🤔'}
          </span>) : ''}
        <span className={`
          ${validate === true && validate === false && 'bg-error text-neutral-content'}
          ${validate === true && valid === true && 'bg-success text-neutral-content'}
          ${validate === true && valid === null && 'bg-base-200 text-base-content'}
          ${validate === false && 'bg-base-content text-base-100'}
       `}>
        {isDegree ? '° ' : gist.units == 'metric' ? 'cm' : 'in'}
        </span>
      </label>
    </div>
  )
}

export default MeasurementInput

