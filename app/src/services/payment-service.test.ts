import { FixedFee, NoWinNoFee } from '../models/fee'
import { calculatePayment, isSettlementValid } from './payment-service'

describe('calculatePayment', () => {
  it('should return correct payment for fixed fee', () => {
    const fee: FixedFee = { type: 'fixed-fee', fee: 100 }
    expect(calculatePayment(fee)).toBe(100)
  })

  test.each([0, 10, 100, 1000])(
    'should return correct payment for no win no fee when fee pct is %s%',
    (pct) => {
      const fee: NoWinNoFee = {
        type: 'no-win-no-fee',
        feePct: pct,
        expectedSettlementAmount: 10,
      }
      const settlement = 100

      expect(calculatePayment(fee, settlement)).toBe((pct / 100) * settlement)
    },
  )

  it('should throw error when settlement is undefined for no win no fee', () => {
    const fee: NoWinNoFee = {
      type: 'no-win-no-fee',
      feePct: 10,
      expectedSettlementAmount: 10,
    }

    expect(() => calculatePayment(fee)).toThrowError()
  })

  it('should throw error when settlement is negative for no win no fee', () => {
    const fee: NoWinNoFee = {
      type: 'no-win-no-fee',
      feePct: -10,
      expectedSettlementAmount: 10,
    }

    expect(() => calculatePayment(fee)).toThrowError()
  })

  // TODO: is a fee pct > 100 valid?
  it('should throw an error when no-win-no-fee percentage is invalid', () => {
    const fee: NoWinNoFee = {
      type: 'no-win-no-fee',
      feePct: -10,
      expectedSettlementAmount: 10,
    }
    const settlement = 100

    expect(() => calculatePayment(fee, settlement)).toThrowError()
  })
})

describe('isSettlmentValid', () => {
  test.each([
    [100, 110],
    [100, 90],
    [100, 95],
  ])(
    'should return valid result when settlement is within 10% of expected',
    (expectedAmount, settlement) => {
      const fee: NoWinNoFee = {
        type: 'no-win-no-fee',
        feePct: 10,
        expectedSettlementAmount: expectedAmount,
      }

      const result = isSettlementValid(fee, settlement)

      expect(result.valid).toBe(true)
    },
  )

  test.each([
    [100, 80],
    [100, 115],
  ])(
    'should return invalid result when settlement is differs by more than 10% of expected',
    (expectedAmount, settlement) => {
      const fee: NoWinNoFee = {
        type: 'no-win-no-fee',
        feePct: 10,
        expectedSettlementAmount: expectedAmount,
      }

      const result = isSettlementValid(fee, settlement)

      expect(result.valid).toBe(false)
    },
  )
})
