import { Alert, Box, Button, Grid, Paper, TextField } from '@mui/material'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { updateJob } from '../api/job-api'
import Job, { isFixedFeeJob, isNoWinNoFeeJob } from '../models/job'
import {
  calculatePayment,
  isSettlementValid,
} from '../services/payment-service'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { pipe } from 'fp-ts/lib/function'
import { match } from 'fp-ts/lib/Either'
import { NoWinNoFee } from '../models/fee'

// TODO: remove duplication between the two submit handlers
const JobPayment: React.FC<{ job: Job; onPaymentSubmitted: () => void }> = ({
  job,
  onPaymentSubmitted,
}) => {
  const [error, setError] = useState<string | undefined>()

  if (job.state === 'paid') return null

  let child: JSX.Element | null = null

  if (isFixedFeeJob(job)) {
    child = (
      <Button
        onClick={async () => {
          const amount = calculatePayment(job.fee)

          const response = await updateJob({
            ...job,
            payment: { status: 'paid', amount },
          })

          pipe(
            response,
            match(
              () => {
                onPaymentSubmitted()
              },
              (err) => setError(err.error),
            ),
          )
        }}
      >
        Pay Fixed Fee
      </Button>
    )
  }

  if (isNoWinNoFeeJob(job)) {
    child = (
      <NoWinNoFeePayment
        job={job}
        onPaymentSubmitted={onPaymentSubmitted}
        onError={(error: string) => setError(error)}
      />
    )
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      {child}
    </>
  )
}

const NoWinNoFeePayment: React.FC<{
  job: Job & { fee: NoWinNoFee }
  onPaymentSubmitted: () => void
  onError: (value: string) => void
}> = ({ job, onPaymentSubmitted, onError }) => {
  const formik = useFormik({
    initialValues: {
      settlement: undefined,
    },
    validationSchema: yup.object({
      settlement: yup
        .number()
        .min(0)
        .test(
          'is-within-expected-range',
          'settlement is not within expected range',
          // TODO: can we use the error message from the validation?
          (value) =>
            value !== undefined && isSettlementValid(job.fee, value).valid,
        )
        .required('settlement is required'),
    }),
    onSubmit: async (values) => {
      const settlement = Number(values.settlement)
      const amountPaid = calculatePayment(job.fee, settlement)

      const response = await updateJob({
        ...job,
        payment: { status: 'paid', amount: amountPaid },
      })

      pipe(
        response,
        match(
          () => {
            onPaymentSubmitted()
          },
          (err) => onError(err.error),
        ),
      )
    },
  })
  return (
    <>
      <Paper>
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                id="settlement"
                name="settlement"
                label="Settlement (£)"
                fullWidth
                value={formik.values.settlement}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                error={formik.touched.settlement && !!formik.errors.settlement}
                helperText={
                  formik.touched.settlement && formik.errors.settlement
                }
              />
            </Grid>
          </Grid>
          <LoadingButton
            color="primary"
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            loading={formik.isSubmitting}
          >
            Pay!
          </LoadingButton>
        </Box>
      </Paper>
    </>
  )
}

export default JobPayment
