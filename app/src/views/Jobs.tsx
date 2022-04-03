import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllJobs } from '../api/job-api'
import JobPayment from '../components/JobPayment'
import Job from '../models/job'

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | undefined>()
  const navigate = useNavigate()

  useEffect(() => {
    getAllJobs().then((result) => {
      pipe(
        result,
        match(
          (res) => {
            setJobs(res)
            setError(undefined)
          },
          (err) => {
            setError(`${err.error}. ${err.message ?? ''}`)
          },
        ),
      )
    })
  }, [])

  return (
    <div>
      <Box sx={{ pt: 1 }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate('/add-job')}
        >
          Add Job
        </Button>
      </Box>
      <hr />
      {error && <Alert severity="error">{error}</Alert>}
      {!jobs.length ? (
        <Typography align="center" variant="h4" gutterBottom component="div">
          No Jobs
        </Typography>
      ) : (
        jobs.map((j) => <JobDetail job={j} key={j._id} />)
      )}
    </div>
  )
}

const JobDetail: React.FC<{ job: Job }> = ({ job }) => {
  // TODO: make this look nice...
  return (
    <Card sx={{ display: 'flex', mt: 2 }}>
      <div>
        <CardContent>
          {/* TODO: these two chips duplicate eachother when job has been paid */}
          <Chip label={job.state} color="primary" />
          <Chip label={job.payment.status} color="primary" />
          <Typography gutterBottom variant="h5" component="div">
            {job.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.fee.type}:
            {job.fee.type === 'fixed-fee'
              ? `£${job.fee.fee}`
              : `${job.fee.feePct}%`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Amount paid:
            {job.payment.status === 'paid'
              ? `£${job.payment.amount}`
              : 'Nothing!'}
          </Typography>
          <JobPayment
            job={job}
            onPaymentSubmitted={() => window.location.reload()}
          />
        </CardContent>
      </div>
    </Card>
  )
}

export default Jobs
