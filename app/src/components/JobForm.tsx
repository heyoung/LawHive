import {
  Alert,
  Box,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useFormik } from 'formik'
import { useState } from 'react'
import * as yup from 'yup'
import { createJob } from '../api/job-api'
import { pipe } from 'fp-ts/lib/function'
import { match } from 'fp-ts/lib/Either'
import { useNavigate } from 'react-router-dom'
import { Fee } from '../models/fee'

const validationSchema = yup.object({
  title: yup.string().required('title is required'),
  description: yup.string().required('description is required'),
  feeType: yup
    .string()
    .test((x) => x === 'no-win-no-fee' || x === 'fixed-fee')
    .required('fee type is required'),
  feePct: yup.number().when('feeType', {
    is: 'no-win-no-fee',
    then: yup.number().max(100).min(0).required('fee percentage is required'),
  }),
  fee: yup.number().when('feeType', {
    is: 'fixed-fee',
    then: yup.number().min(0).required('fee is required'),
  }),
  expectedSettlementAmount: yup.number().when('feeType', {
    is: 'no-win-no-fee',
    then: yup
      .number()
      .min(0)
      .required('expected settlement amount is required for no-win-no-fee'),
  }),
})

const JobForm: React.FC = () => {
  const [error, setError] = useState<string | undefined>()
  const navigate = useNavigate()

  const formik = useFormik<{
    title: string
    description: string
    feeType: string
    feePct?: number
    fee?: number
    expectedSettlementAmount?: number
  }>({
    initialValues: {
      title: '',
      description: '',
      feeType: 'no-win-no-fee',
      feePct: undefined,
      fee: undefined,
      expectedSettlementAmount: undefined,
    },
    validationSchema,
    onSubmit: async (values) => {
      let fee: Fee | null = null

      // feePct and fee should not be undefined here based on the validator above.
      // but we throw the error to ensure TS shows the correct types here
      if (values.feeType === 'no-win-no-fee') {
        if (values.feePct === undefined) {
          throw new Error('feePct is undefined')
        }

        fee = {
          type: 'no-win-no-fee',
          feePct: Number(values.feePct),
          expectedSettlementAmount: Number(values.expectedSettlementAmount),
        }
      } else {
        if (values.fee === undefined) {
          throw new Error('fee is undefined')
        }

        fee = { type: 'fixed-fee', fee: Number(values.fee) }
      }

      const response = await createJob({
        title: values.title,
        description: values.description,
        fee,
      })

      pipe(
        response,
        match(
          () => {
            navigate('/jobs')
          },
          (err) => {
            setError(`${err.error}. ${err.message}`)
          },
        ),
      )
    },
  })

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
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
          <Typography variant="h4" gutterBottom component="div">
            Add Job
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="title"
                name="title"
                label="Title"
                fullWidth
                value={formik.values.title}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                error={formik.touched.title && !!formik.errors.title}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="description"
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                error={
                  formik.touched.description && !!formik.errors.description
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                labelId="fee-type-select"
                id="fee-type-select"
                name="feeType"
                label="Fee Type"
                value={formik.values.feeType}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                error={formik.touched.feeType && !!formik.errors.feeType}
              >
                <MenuItem value={'no-win-no-fee'}>No Win No Fee</MenuItem>
                <MenuItem value={'fixed-fee'}>Fixed</MenuItem>
              </Select>
            </Grid>
            {formik.values.feeType === 'no-win-no-fee' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    id="feePct"
                    name="feePct"
                    label="Fee %"
                    fullWidth
                    value={formik.values.feePct}
                    onChange={formik.handleChange}
                    disabled={formik.isSubmitting}
                    error={formik.touched.feePct && !!formik.errors.feePct}
                    helperText={formik.touched.feePct && formik.errors.feePct}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    id="expectedSettlementAmount"
                    name="expectedSettlementAmount"
                    label="Expected Settlement Amount"
                    fullWidth
                    value={formik.values.expectedSettlementAmount}
                    onChange={(e) => {
                      console.log(e)
                      formik.handleChange(e)
                    }}
                    disabled={formik.isSubmitting}
                    error={
                      formik.touched.expectedSettlementAmount &&
                      !!formik.errors.expectedSettlementAmount
                    }
                    helperText={
                      formik.touched.expectedSettlementAmount &&
                      formik.errors.expectedSettlementAmount
                    }
                  />
                </Grid>
              </>
            )}
            {formik.values.feeType === 'fixed-fee' && (
              <Grid item xs={12}>
                <TextField
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  id="fee"
                  name="fee"
                  label="Fixed Fee (£)"
                  fullWidth
                  value={formik.values.fee}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                  error={formik.touched.fee && !!formik.errors.fee}
                  helperText={formik.touched.fee && formik.errors.fee}
                />
              </Grid>
            )}
          </Grid>
          <LoadingButton
            color="primary"
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            loading={formik.isSubmitting}
          >
            Save
          </LoadingButton>
        </Box>
      </Paper>
    </>
  )
}

export default JobForm
