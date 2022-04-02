import { Alert, Box, Grid, Paper, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useFormik } from 'formik'
import { useState } from 'react'
import * as yup from 'yup'

const validationSchema = yup.object({
  title: yup.string().required('title is required'),
  description: yup.string().required('description is required'),
})

const JobForm: React.FC = () => {
  const [error, setError] = useState<string | undefined>()

  const formik = useFormik({
    initialValues: { title: '', description: '' },
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
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
                id="name"
                name="name"
                label="Name"
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
